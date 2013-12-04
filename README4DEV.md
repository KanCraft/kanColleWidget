# Set Up
```sh
npm install
grunt build
```

# Testing

## Running the test
1. Install `test` directory into your Chrome as an extension.
2. Open `Option Page` of the extension.
3. Test will run that page. (Jasmine output)

# Developing

## Edit
To edit source, you should edit `src/`.

## Run App
1. Open page `chrome://extensions` on you Chrome Browser.
2. Enable `Developer mode`.
3. Click `Install unpackaged extension`.
4. Choose `release/kanColleWidget` directory as `unpackaged extension`.

then your app is available in your browser button.

## Affecting changes of `src` to `test/src`
```
grunt watch
```
watching changes in `src/*` and copy into `test/src/*`,
so affecting test output automatically.

Let's start editing `src/`! :+1:

## Adding new file to `src/`
If you want to add new files in `src/`,
you have to add new path reference to `test/SpecRnner.html`.

# Happy Hacking!
![zkms](test/zkms.png)
