
module KCW.Infra {
    export interface TrimOption {
        format: string;
    }
    export class ImageTrimmer {
        constructor(private imgURI: string) {}
        public trim(coords: Coordinates, size: Size, opt: TrimOption = {format:'jpeg'}): string {
            var img = new Image();
            img.src = this.imgURI;

            var canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            canvas.width  = size.width;
            canvas.height = size.height;
            var ctx = canvas.getContext('2d');

            ctx.drawImage(
                img,
                coords.left,
                coords.top,
                size.width,
                size.height,
                0, // offset left in destination Image
                0, // offset top in destination Image
                canvas.width,
                canvas.height
            );

            return canvas.toDataURL('image/' + opt.format);
        }
    }
}