# NodeReload

NodeReload is a simple alternative LiveReload implementation for Windows 7 using node.js. It allows you to use the LiveReload browser extensions without the LiveReload native program.

This is intended to be a temporary fix, until the LiveReload binaries for Windows are up to scratch.

## What it supports

* Triggering the browser reload on a file change, instantly.
* Live CSS reloading.

## What it doesn't support

* LESS, minifying, combining, or any other kind of processing of files.

## How to use

* Install a LiveReload browser extension: http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
* Install node.js for windows: http://nodejs.org/
* Download and upzip this project: https://github.com/Epskampie/nodereload/zipball/master
* Add the directories you want to watch to the top of __directories.js__ (instructions inside).
* Start nodereload__.bat__
* Start the browser extension.
* Watch as your browser automatically refreshes when you change a file in one of the watched directories.