# Components

ここは、Chrome拡張のドメイン `chrome-extension://xxxxxxxxxxx` で表示されるウェブページのViewを集めるところです.

なお、同ドメインで重複して `chrome.runtime.onMessage.addListener` などをすると、本来有効であるべき `background_page` での `onMessage` が優先されず、client側で `disconnected` あるいは `Not found` を受け取ってしまうので、このディレクトリで定義されるウェブページでは `runtime.onMessage` をlistenしてはいけない.