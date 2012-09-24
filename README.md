# nodereload

NodeReload is an simple alternative LiveReload implementation for Windows 7 using node.js. It allows you to use the LiveReload browser extensions without the LiveReload native program.

This is intended to be a temporary fix, until the LiveReload binaries for Windows are up to scratch.

## What does it support

* Triggering the browser reload on a file change, instantly.
* Live CSS reloading.

## What doesn't it support

* LESS, Minifying, combining, or any other kind of processing of files.

## How to use

* Install a LiveReload browser extension: http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
* Install node.js for windows: http://nodejs.org/
* Download and upzip this project: https://github.com/Epskampie/nodereload/zipball/master
* Add the directories you want to watch to the top of nodereload__.js__ (instructions inside).
* Execute nodereload__.bat__
* Start the browser extension.
* Watch as your browser automatically refreshes as you change a file in one of the watched directories.