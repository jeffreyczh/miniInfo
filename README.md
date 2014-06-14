miniInfo
========

A simple and lightweight mini Information Book that saves your contacts, as well as password information. Encryption is provided.


##Applied Techniques

**JQuery**, **JQuery UI**, **AngularJS**, **Node.JS**, **Node-Webkit**

##Details

This is an easy-to-use information book and you can save contacts and their address to this book. You can also save your User Name --- Password pairs so that you don't need to remember those information of different accounts anymore. Data is encrypted for storage. The data is portable which enables you to carry and import the data to any machines with this app installed.

The project is built on the top of [Node-Webkit](https://github.com/rogerwang/node-webkit) to allows the app, which is written in HTML and JavaScript, to run on different platform as a desktop app. [Node.js](http://nodejs.org/) in this project is used for accessing the local file system and encryption/decryption. [AngularJS](https://angularjs.org/) is applied for MVC implementation. 

##How to run or package and distribute the app

Firstly, please have [Node.js](http://nodejs.org/) and [Node-Webkit](https://github.com/rogerwang/node-webkit) installed in your machine before continuing the following steps.

###Run the app with Node-Webkit

1. Zip all the files to a `.nw ` file:

    Linux:

    zip -r miniInfo.nw *

    
    Windows:

    1. Zip all the files to a `.zip` file
    2. Rename the suffix to `.nw`
    
2. Use the **Node-Webkit** to open the generated `miniInfo.nw` file:

    `./nw miniInfo.nw`    
    
Note: on Windows, you can drag the `miniInfo.nw` to `nw.exe` to open it.

###Package and distribute the app to an executable file

Linux:

    cat ./nw miniInfo.nw > miniInfo && chmod +x miniInfo
    
Then, copy the `nw.pak` file from the **Node-Webkit** prebuild library to the folder where the new `miniInfo` is in.

Windows:

    copy /b nw.exe+miniInfo.nw miniInfo.exe
    
Then copy the `nw.pak` and `icudt.dll` from the **Node-Webkit** prebuild library to the folder where the new `miniInfo` is in.

##About the data

* The `data` file will be created or overwritten when the information is modified (adding, editing or deleting an entry). To import the data, just simply copy this `data` file to the folder where the executable file is in.
* **Crypto**, which is a module in **Node.js**, is used for encryption and decryption.  **AES-256** is applied for encrypting the data.
