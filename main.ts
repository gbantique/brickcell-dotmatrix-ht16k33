let ht16k33 = Brickcell.create(0)
let smile = [
60,
66,
165,
129,
165,
153,
66,
60
]
let frown = [
60,
66,
165,
129,
153,
165,
66,
60
]
basic.forever(function () {
    ht16k33.setBrightness(15)
    ht16k33.render(smile)
    basic.pause(1000)
    ht16k33.setBrightness(3)
    ht16k33.render(frown)
    basic.pause(1000)
})
