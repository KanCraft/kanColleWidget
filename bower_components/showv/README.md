# showv [![Build Status](https://travis-ci.org/otiai10/showv.svg?branch=master)](https://travis-ci.org/otiai10/showv)

No more than a simple view class by TypeScript.

![showv](showv.jpg)

# usage
```javascript
/// <reference path="your/path/to/showv.d.ts" />

class MyAppView extends showv.View {
    constructor(private user: TwitterUser/* or any your model */) {
        super({
            tagName: 'li',
            class: 'tweets',
        });
    }
    events(): Object {
        var events = {
            'click .user-name': 'jumpToUser'
        };
        return events;
    }
    jumpToUser() {
        location.href = this.user.toURL();
    }
}
```

# set up
```
git clone git@github.com:otiai10/showv.git
cd showv
npm install
bower install
testem
```
