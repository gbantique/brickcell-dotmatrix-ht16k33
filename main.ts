serial.setBaudRate(BaudRate.BaudRate19200)
let ht16k33 = Brickcell.create(112)
// let count = 0
ht16k33.setup(2)
ht16k33.setBrightness(1)
ht16k33.renderMessage("abcd")
// ht16k33.renderChar('a');
basic.pause(500)
// basic.showNumber(count)
// ht16k33.renderFonts()
// count += 1
// basic.pause(300)
basic.forever(function () {
	
})
