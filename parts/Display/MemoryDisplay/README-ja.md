# MemoryDisplay
シャープのメモリディスプレイモジュールです。
Adafruit社から1.3インチ、秋月電子から2.7インチの液晶が販売されています。
[Adafruit SHARP Memory Display Breakout - 1.3" 168x144](https://www.adafruit.com/product/3502)
[Adafruit SHARP Memory Display Breakout - 1.3" 96x96](https://www.adafruit.com/product/1393)
[秋月電子 シャープ　モノクロＨＲ－ＴＦＴメモリ液晶モジュール　２．７インチ](http://akizukidenshi.com/catalog/g/gP-04944/)

## wired(obniz,  {[vcc, gnd, vcc_a, gnd_a, sclk, mosi, cs, disp, extcomin, extmode, width, height]} )
obnizに液晶モジュールをつなぎます。
1.3インチの液晶ユニットは3.3V駆動です。vinは5V出力になりますので、Adafruit製以外のモジュールを使用する場合は注意してください。
液晶との通信にSPIを使用しています。使用していないSPIが1つ以上必要です。
widthに液晶の横ドット数、heightに縦ドット数を指定します。
Adafruit製のモジュールはvcc_a, gnd_a, disp, extcomin, extmodeは指定する必要はありません。(基板内で配線されています。)
```javascript
// 144x168ピクセルの液晶モジュールを接続(Adafruit製モジュール)
mdisp = obniz.wired("MemoryDisplay", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
```
秋月電子の2.7インチ液晶モジュールの場合はvcc_a, gnd_a, disp, extcomin, extmodeを指定する必要があります。
2.7インチ液晶の場合は5V駆動ですので、レベル変換回路などは不要です。
```javascript
// 400x240ピクセルの液晶モジュールを接続(秋月電子製モジュール)
mdisp = obniz.wired("MemoryDisplay", {vcc:6 , gnd:8, vcc_a:5, gnd_a:9, sclk:0 , mosi:1, cs:2, disp:4, extcomin:3, extmode:7, width:400, height:240});
```

#描画関数
描画関数はDisplayと共通です。(qr関数を除く。)
詳しくは[Displayのページ](https://obniz.io/doc/sdk/doc/display)をご覧ください。

# Canvas contextを使って画像を表示するサンプル
"Image address here"の部分を画像のアドレスに変えると、二値化された画像がディスプレイに表示されます。
```javascript
mdisp = obniz.wired("MemoryDisplay", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
mdisp.clear();

var canvas = document.getElementById('canvas1');
if ( ! canvas || ! canvas.getContext ) { return false; }
var ctx = canvas.getContext('2d');
var img = new Image();
img.src = "Image address here";
img.onload = function() {
  ctx.drawImage(img,0,0);
  mdisp.draw(ctx);
}
```
