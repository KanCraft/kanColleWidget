
(window as any).requestFileSystem = (type: number, size: number, callback: (any) => void) => {
  callback(true); // TODO: trueじゃねえだろ
};


