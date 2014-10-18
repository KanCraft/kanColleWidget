
module KCW {
    export class WindowBlank {
        constructor(public offsetLeft: number,
                    public offsetTop: number,
                    public width: number,
                    public height: number) {}
        public static calculate(wholeWidth: number, wholeHeight: number): WindowBlank {
            var screen = {width:wholeWidth, height:wholeHeight};
            var aspect = 0.6;
            var blank = {
                offsetTop:0, offsetLeft:0,
                height:0, width:0};
            if (screen.height / screen.width < aspect) {
                blank.width = screen.width - (screen.height / aspect);
                blank.offsetLeft = blank.width / 2;
            } else {
                blank.height = screen.height - (screen.width * aspect);
                blank.offsetTop = blank.height / 2;
            }
            return new WindowBlank(
                blank.offsetLeft,
                blank.offsetTop,
                blank.width,
                blank.height
            );
        }
    }
}