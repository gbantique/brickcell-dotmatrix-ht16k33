let ht16k33 = Brickcell.create(0x70)
ht16k33.setup(2)
ht16k33.setBrightness(3)
ht16k33.renderMessage("abcd")
// ht16k33.renderChar('a');
basic.pause(3000);
basic.forever(function () {
	//ht16k33.renderFonts();
    //basic.pause(300)
})
