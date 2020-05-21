# OverReact Format on Save
This is a VS Code extension meant to enable OverReact Format to run when a file is saved. This is reliant on having `over_react_format: ^3.1.0` as a dependency in your Dart project. 

## Setting up the extension
1. __Install the extension:__ This extension is hosted publically in the VS Code Extensions Marketplace, so the instructions are the same as any extension and can be found [here](https://code.visualstudio.com/docs/editor/extension-gallery). When searching through the extensions, look for `OverReact Format on Save`.
1. __Enable the formatter:__ Open the Command Palette (__&#8984; + &#8679; + P__ by default) and search for `OverReact Format on Save: Enable`. This will allow the formatter to be run, and can be disabled by using the `OverReact Format on Save: Disable` command.
1. You're good to go!

## Enabling Line-Length Detection
This extension has the capability to pull a line-length from the standard `dart_dev/config.dart` file used to configure Workiva's DartDev tool. If your library contains the config file and has a line-length specified, this is how to enable that feature:

1. Go to VS Code's settings (__&#8984; + ,__ by default).
1. Navigate to the Extension settings, using the menu on the left of the settings window.
1. In the dropdown for "Extensions", find "OverReact Format..." and click on it.
1. Check the box for "Format on Save: Detect Custom Line Length".

## Setting a Custom Line-Length
In the case you do not utilize a line-length setting as part of DartDev but are used to running `pub run over_react_format` with a custom line-length, it is possible to set that through the extension using the "Custom Line Length" setting. This is how to enable that:

1. Go to VS Code's settings (__&#8984; + ,__ by default).
1. Navigate to the Extension settings, using the menu on the left of the settings window.
1. In the dropdown for "Extensions", find "OverReact Format..." and click on it.
1. Enter a value for "Format on Save: Custom Line Length".

__NOTE:__ Both that and `Detect Custom Line Length` cannot be set at the same time. If `Custom Line Length` is greater than `0`, it is considered set. In this occurs, `Custom Line Length` will take precendence and auto detection will be skipped. 

**Enjoy!**
