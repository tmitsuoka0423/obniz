# BLE Peripheral - Characteristic

## new characteristic(json)

```Javascript
await obniz.ble.initWait(); 
var characteristic = new obniz.ble.characteristic({
        "uuid" : "FFF1",
        "properties" : ["read","write"],  // read, write, notify
        "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
        "descriptors" : [{
            "uuid" : "2901",   //Characteristic User Description
            "text" : "hello world characteristic",    //data for dataArray or  text for string
        }]
});

var service = new obniz.ble.service({
                  "uuid" : "fff0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

<!--
## characteristic.write(data)
write data on characteristic

## characteristic.onwrite(data)
callback of characteristic.wite


```Javascript 

characteristic.write([0xf0,0x27]);
characteristic.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->

## \[await] characteristic.writeWait(data)
This writes data on characteristic.
It throws an error when failed.

```Javascript 
await characteristic.writeWait([0xf0,0x27]);
console.log("write success");

```
<!--
## characteristic.read(data)
read data on characteristic

## characteristic.onread(data)
callback of characteristic.read

```Javascript 

characteristic.read();
characteristic.onread = function(val){
    console.log("read data :",val.data);
}


```
-->
## \[await] characteristic.readWait()
This reads data on characteristic.
It returns data array when it successds.
It throws an error when failed.

```Javascript 
let data =  await characteristic.readWait()
console.log("data: " , data );


```

## characteristic.onwritefromremote(address, newvalue)
This is a callback function used when characteristic gets changed by an external device.

| property | type | description |
|:---- |:---- |:---- |
| `address` |  array  | central device address |
| `newvalue` |  array  | written data |

```Javascript 

characteristic.onwritefromremote = function(address, newvalue){
    console.log("remote address :",address);
    console.log("remote data :",newvalue);
}

```

## characteristic.onreadfromremote(address)
This is a callback function used when characteristic is read by an external device.

| property | type | description |
|:---- |:---- |:---- |
| `address` |  array  | central device address |

```Javascript 

characteristic.onreadfromremote = function(address){
    console.log("remote address :",address);	
}

```


## characteristic.notify()
This sends notify to the connected central.

```javascript
var characteristic = new obniz.ble.characteristic({
  uuid: 'FFF1',
  data: [0x0e, 0x00],
  properties : ["read","write","notify"],  // add notify properties
 
});

var service = new obniz.ble.service({
  uuid: 'FFF0',
  characteristics: [characteristic],
});
obniz.ble.peripheral.addService(service);


// after central connected
characteristic.notify();

```