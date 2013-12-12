var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var KanColleWidget = KanColleWidget || {};
(function(){
    var Fs = KanColleWidget.Fs = {};
    // レスポンス＼(^o^)／オブジェクト
    Fs.Response = {
        /* string */  purpose : '',
        /* int */      status : 0,
        /* string */  message : '',
        /* Error */     error : null,
        /* FileEntry */ entry : null, //保存されたエントリ
        /* File */     origin : null //選択されたオリジナルなファイルエントリ
    };
    // レスポンスオブジェクト作るメソッド
    Fs.responseFactory = function(status, message, entry, error){
        this.Response.status = status;
        this.Response.message = message;
        this.Response.error = error || null;
        this.Response.entry = entry || null;
        this.Response.origin = this.origin;
        this.Response.purpose = this.purpose;
        return this.Response;
    };

    // 受付可能なファイルタイプのリスト
    Fs.accepts = [];
    // 保存目的
    Fs.purpose;
    // 最終保存パス
    Fs.destination;

    // サイズ制限
    Fs.SIZE_LIMIT = 1024 * 1024 * 5;// 5MB

    // エラーハンドリング
    Fs.onError = function(error){
        var message = '';
        for ( var key in error){
            message += key + "=" + error[key] + ',';
        }
        return this.responseFactory(0, message, null, error);
    };

    /**
     * ファイルのバリデーションをする
     * @param file
     * @returns {boolean}
     * @private
     */
    Fs._validate = function(file){
        if (! this._validateUndefined(file)) return false;
        if (! this._validateFileType(file)) return false;
        if (! this._validateFileSize(file)) return false;
        return true;
    };
    /**
     * ファイルが選択されてないけど来た場合をバリデーションする
     * @param file
     * @returns {boolean}
     * @private
     */
    Fs._validateUndefined = function(file) {
        if(typeof file == 'undefined'){
            this.Response.status = 0;
            this.Response.message = "キャンセルされましたー";
            return false;
        }
        return true;
    };
    /**
     * ファイルタイプをバリデーションする
     * @param file
     * @returns {boolean}
     * @private
     */
    Fs._validateFileType = function(file){
        var acceptable = false;
        for (var i in this.accepts) {
            if (file.type.match(this.accepts[i])) {
                acceptable = true;
            }
        }
        if (! acceptable) {
            this.Response.status = 0;
            this.Response.message = "ファイル種別が違います";
            return false;
        }
        return true;
    };
    /**
     * ファイルサイズをバリデーションする
     * @param file
     * @returns {boolean}
     * @private
     */
    Fs._validateFileSize = function(file){
        if( file.size > this.SIZE_LIMIT ){
            this.Response.status = 0;
            this.Response.message = "ファイルサイズが大きすぎます。"+ this.SIZE_LIMIT/(1024*1024) +"MB未満のファイルにしてください。";
            return false;
        }
        return true;
    };

    // 保存ファイルパスを決定
    Fs.defineDestination = function(){
        var ext = this.origin.type.replace(/^[a-zA-Z]+\//,'');
        return this.purpose + '.' + ext;
    };

    // 削除 /* public */
    // delete : function(){},
    // 読み込み /* public */
    // read : function(){},

    // 書き込み /* public */
    Fs.write = function(purpose, file, accepts, callbackFunc){

        this.purpose = purpose;
        this.origin = file;
        this.accepts = accepts;
        this.callback = callbackFunc;

        if(!this._validate(file)) return this.callback(this.Response);

        //for( var key in file ){
        //    console.log(key + "=" + file[key]);
        //}

        this.destination = this.defineDestination();

        var self = this;
        requestFileSystem(
            window.PERSISTENT,
            self.SIZE_LIMIT,
            function(fileSystem){
                // オリジナルな名前で保存するとfilesystem:chrome-extension://***/persistent/以下がヤバい
                fileSystem.root.getFile(
                    self.destination,
                    { create: true, exclusive: false },
                    function(fileEntry){
                        fileEntry.createWriter(function(fileWriter){

                            // add listeners
                            fileWriter.onwriteend = function(event){
                                self.responseFactory(1,'Write completed',fileEntry,null);
                                self.callback(self.Response);
                            };
                            fileWriter.onerror = self.onError;

                            // execute
                            fileWriter.write(file);

                        }, self.onError);
                    },
                    self.onError
                );
            },
            self.onError
        );
    };

    // TODO: 上記writeとDRYにする
    // 更新 /* public */
    Fs.update = function(purpose, file, accepts, callbackFunc){

        this.purpose = purpose;
        this.origin = file;
        this.accepts = accepts;
        this.callback = callbackFunc;

        if(!this._validate(file)) return this.callback(this.Response);

        //for( var key in file ){
        //    console.log(key + "=" + file[key]);
        //}

        this.destination = this.defineDestination();

        var self = this;
        self.delete(
            this.destination,
            function(){
                self.write(purpose,file,accepts,callbackFunc);
            },
            function(){
                //console.log('多分初回はremoveでエラー');
                // 雑だなー
                self.write(purpose,file,accepts,callbackFunc);
            }
        );
    };

    // 削除 /* private */
    Fs.delete = function(f_path, success_callback, error_callback){
        var self = this;
        requestFileSystem(
            window.PERSISTENT,
            self.SIZE_LIMIT,
            function(fileSystem){
                fileSystem.root.getFile(
                    f_path,
                    { create: true, exclusive: false },
                    function(fileEntry){
                        fileEntry.remove(
                            function(){
                                success_callback();
                            },
                            function(){
                                error_callback()
                            }
                        );
                    },
                    self.onError
                );
            },
            self.onError
        );
    };
})();
