
(window as any).requestFileSystem = (type: number, size: number, callback: (any) => void) => {
  class FileWriter {
    write(/* data: any */) {
      this.onwriteend();
    }
    onwriteend() {
      // do nothing
    }
  }
  class Entry {
    remove(onSuccess: (any) => any, /* onError: (any) => any */) {
      onSuccess({});
    }
    createWriter(onSuccess: (any) => any) {
      onSuccess(new FileWriter());
    }
    toURL(): string {
      return "Hello, this is dummy Entry";
    }
  }
  callback({
    root: {
      getFile(
        filepath: string,
        opt: {create?: boolean, recursive?: boolean},
        onSuccess: (any) => any,
        /* onError: (any) => any */) {
        onSuccess(new Entry());
      }
    },
  });
};


