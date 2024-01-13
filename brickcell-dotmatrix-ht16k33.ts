/**
 * makecode HT16K33 led backpack Package
 */

//% weight=100 color=#00a7e9 icon="\uf26c" block="HT16K33"
namespace Brickcell {
    enum HT16K33_I2C_ADDRESSES {
        ADDR_0x70 = 0x70,
        ADDR_0x71 = 0x71,
        ADDR_0x72 = 0x72,
        ADDR_0x73 = 0x73,
        ADDR_0x74 = 0x74,
        ADDR_0x75 = 0x75,
        ADDR_0x76 = 0x76,
        ADDR_0x77 = 0x77,
    }

    enum HT16K33_COMMANDS {
        TURN_OSCILLATOR_ON = 0x21,
        TURN_DISPLAY_ON = 0x81,
        SET_BRIGHTNESS = 0xE0
    }

    enum HT16K33_CONSTANTS {
        DEFAULT_ADDRESS = HT16K33_I2C_ADDRESSES.ADDR_0x70,
        MAX_BRIGHTNESS = 15,
        MAX_BLINK_RATE = 3
    }

    enum HT16K33_ROTATION_DIRECTION {
        NONE = 0,
        CLOCKWISE = 1,
        DEGREES_180 = 2,
        COUNTER_CLOCKWISE = 3
    };

    export class HT16K33 {
        private matrixAddress: number;

        // ASCII fonts borrowed from https://github.com/lyle/matrix-led-font/blob/master/src/index.js
        private font: string[] = [" ", "!", "\"", "#", "$", "%", "&", "\'", "(", ")",
            "*", "+", ",", "-", ".", "/",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            ":", ";", "<", "=", ">", "?", "@",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
            "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "[", "\\", "]", "_", "`",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
            "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "{", "|", "}", "~", "^"];
        private font_matrix: number[][] = [
            [0b00000000, 0b00000000, 0b00000000, 0b00000000],
            [0b01011111, 0b00000000],
            [0b00000011, 0b00000000, 0b00000011, 0b00000000],
            [0b00010100, 0b00111110, 0b00010100, 0b00111110, 0b00010100, 0b00000000],
            [0b00100100, 0b01101010, 0b00101011, 0b00010010, 0b00000000],
            [0b01100011, 0b00010011, 0b00001000, 0b01100100, 0b01100011, 0b00000000],
            [0b00110110, 0b01001001, 0b01010110, 0b00100000, 0b01010000, 0b00000000],
            [0b00000011, 0b00000000],
            [0b00011100, 0b00100010, 0b01000001, 0b00000000],
            [0b01000001, 0b00100010, 0b00011100, 0b00000000],
            [0b00101000, 0b00011000, 0b00001110, 0b00011000, 0b00101000, 0b00000000],
            [0b00001000, 0b00001000, 0b00111110, 0b00001000, 0b00001000, 0b00000000],
            [0b10110000, 0b01110000, 0b00000000],
            [0b00001000, 0b00001000, 0b00001000],
            [0b01100000, 0b01100000, 0b00000000],
            [0b01100000, 0b00011000, 0b00000110, 0b00000001, 0b00000000],
            [0b00111110, 0b01000001, 0b01000001, 0b00111110, 0b00000000],
            [0b01000010, 0b01111111, 0b01000000, 0b00000000],
            [0b01100010, 0b01010001, 0b01001001, 0b01000110, 0b00000000],
            [0b00100010, 0b01000001, 0b01001001, 0b00110110, 0b00000000],
            [0b00011000, 0b00010100, 0b00010010, 0b01111111, 0b00000000],
            [0b00100111, 0b01000101, 0b01000101, 0b00111001, 0b00000000],
            [0b00111110, 0b01001001, 0b01001001, 0b00110000, 0b00000000],
            [0b01100001, 0b00010001, 0b00001001, 0b00000111, 0b00000000],
            [0b00110110, 0b01001001, 0b01001001, 0b00110110, 0b00000000],
            [0b00000110, 0b01001001, 0b01001001, 0b00111110, 0b00000000],
            [0b00010100, 0b00000000],
            [0b00100000, 0b00010100, 0b00000000],
            [0b00001000, 0b00010100, 0b00100010, 0b00000000],
            [0b00010100, 0b00010100, 0b00010100, 0b00000000],
            [0b00100010, 0b00010100, 0b00001000, 0b00000000],
            [0b00000010, 0b01011001, 0b00001001, 0b00000110, 0b00000000],
            [0b00111110, 0b01001001, 0b01010101, 0b01011101, 0b00001110, 0b00000000],
            [0b01111110, 0b00010001, 0b00010001, 0b01111110, 0b00000000],
            [0b01111111, 0b01001001, 0b01001001, 0b00110110, 0b00000000],
            [0b00111110, 0b01000001, 0b01000001, 0b00100010, 0b00000000],
            [0b01111111, 0b01000001, 0b01000001, 0b00111110, 0b00000000],
            [0b01111111, 0b01001001, 0b01001001, 0b01000001, 0b00000000],
            [0b01111111, 0b00001001, 0b00001001, 0b00000001, 0b00000000],
            [0b00111110, 0b01000001, 0b01001001, 0b01111010, 0b00000000],
            [0b01111111, 0b00001000, 0b00001000, 0b01111111, 0b00000000],
            [0b01000001, 0b01111111, 0b01000001, 0b00000000],
            [0b00110000, 0b01000000, 0b01000001, 0b00111111, 0b00000000],
            [0b01111111, 0b00001000, 0b00010100, 0b01100011, 0b00000000],
            [0b01111111, 0b01000000, 0b01000000, 0b01000000, 0b00000000],
            [0b01111111, 0b00000010, 0b00001100, 0b00000010, 0b01111111, 0b00000000],
            [0b01111111, 0b00000100, 0b00001000, 0b00010000, 0b01111111, 0b00000000],
            [0b00111110, 0b01000001, 0b01000001, 0b00111110, 0b00000000],
            [0b01111111, 0b00001001, 0b00001001, 0b00000110, 0b00000000],
            [0b00111110, 0b01000001, 0b01000001, 0b10111110, 0b00000000],
            [0b01111111, 0b00001001, 0b00001001, 0b01110110, 0b00000000],
            [0b01000110, 0b01001001, 0b01001001, 0b00110010, 0b00000000],
            [0b00000001, 0b00000001, 0b01111111, 0b00000001, 0b00000001, 0b00000000],
            [0b00111111, 0b01000000, 0b01000000, 0b00111111, 0b00000000],
            [0b00001111, 0b00110000, 0b01000000, 0b00110000, 0b00001111, 0b00000000],
            [0b00111111, 0b01000000, 0b00111000, 0b01000000, 0b00111111, 0b00000000],
            [0b01100011, 0b00010100, 0b00001000, 0b00010100, 0b01100011, 0b00000000],
            [0b00000111, 0b00001000, 0b01110000, 0b00001000, 0b00000111, 0b00000000],
            [0b01100001, 0b01010001, 0b01001001, 0b01000111, 0b00000000],
            [0b01111111, 0b01000001, 0b00000000],
            [0b00000001, 0b00000110, 0b00011000, 0b01100000, 0b00000000],
            [0b01000001, 0b01111111, 0b00000000],
            [0b01000000, 0b01000000, 0b01000000, 0b01000000, 0b00000000],
            [0b00000001, 0b00000010, 0b00000000],
            [0b00100000, 0b01010100, 0b01010100, 0b01111000, 0b00000000],
            [0b01111111, 0b01000100, 0b01000100, 0b00111000, 0b00000000],
            [0b00111000, 0b01000100, 0b01000100, 0b00101000, 0b00000000],
            [0b00111000, 0b01000100, 0b01000100, 0b01111111, 0b00000000],
            [0b00111000, 0b01010100, 0b01010100, 0b00011000, 0b00000000],
            [0b00000100, 0b01111110, 0b00000101, 0b00000000],
            [0b10011000, 0b10100100, 0b10100100, 0b01111000, 0b00000000],
            [0b01111111, 0b00000100, 0b00000100, 0b01111000, 0b00000000],
            [0b01000100, 0b01111101, 0b01000000, 0b00000000],
            [0b01000000, 0b10000000, 0b10000100, 0b01111101, 0b00000000],
            [0b01111111, 0b00010000, 0b00101000, 0b01000100, 0b00000000],
            [0b01000001, 0b01111111, 0b01000000, 0b00000000],
            [0b01111100, 0b00000100, 0b01111100, 0b00000100, 0b01111000, 0b00000000],
            [0b01111100, 0b00000100, 0b00000100, 0b01111000, 0b00000000],
            [0b00111000, 0b01000100, 0b01000100, 0b00111000, 0b00000000],
            [0b11111100, 0b00100100, 0b00100100, 0b00011000, 0b00000000],
            [0b00011000, 0b00100100, 0b00100100, 0b11111100, 0b00000000],
            [0b01111100, 0b00001000, 0b00000100, 0b00000100, 0b00000000],
            [0b01001000, 0b01010100, 0b01010100, 0b00100100, 0b00000000],
            [0b00000100, 0b00111111, 0b01000100, 0b00000000],
            [0b00111100, 0b01000000, 0b01000000, 0b01111100, 0b00000000],
            [0b00011100, 0b00100000, 0b01000000, 0b00100000, 0b00011100, 0b00000000],
            [0b00111100, 0b01000000, 0b00111100, 0b01000000, 0b00111100, 0b00000000],
            [0b01000100, 0b00101000, 0b00010000, 0b00101000, 0b01000100, 0b00000000],
            [0b10011100, 0b10100000, 0b10100000, 0b01111100, 0b00000000],
            [0b01100100, 0b01010100, 0b01001100, 0b00000000],
            [0b00001000, 0b00110110, 0b01000001, 0b00000000],
            [0b01111111, 0b00000000],
            [0b01000001, 0b00110110, 0b00001000, 0b00000000],
            [0b00001000, 0b00000100, 0b00001000, 0b00000100, 0b00000000],
            [0b00000010, 0b00000001, 0b00000010, 0b00000000]];


        constructor() {
            this.matrixAddress = HT16K33_CONSTANTS.DEFAULT_ADDRESS;
        }

        private sendCommand(command: HT16K33_COMMANDS): void {
            pins.i2cWriteNumber(this.matrixAddress, 0, NumberFormat.Int8LE, false);
            pins.i2cWriteNumber(this.matrixAddress, command, NumberFormat.Int8LE, false);
        }

        private rotateMatrix(matrix: number[], rotationDirection: HT16K33_ROTATION_DIRECTION): number[] {
            const rows = matrix.length;
            const rotatedMatrix: number[] = [];

            for (let row = 0; row < rows; row++) {
                const index = row;

                switch (rotationDirection) {
                    case HT16K33_ROTATION_DIRECTION.CLOCKWISE:
                        rotatedMatrix[index] = matrix[rows - row - 1];
                        break;
                    case HT16K33_ROTATION_DIRECTION.COUNTER_CLOCKWISE:
                        rotatedMatrix[index] = matrix[row];
                        break;
                    case HT16K33_ROTATION_DIRECTION.DEGREES_180:
                        rotatedMatrix[index] = matrix[rows - row - 1];
                        break;
                    default:
                        break;
                }
            }

            return rotatedMatrix;
        }

        private offsetDisplay(value: number): number {
            return (value >> 1) | (value << 7);
        }

        private formatBitmap(bitmap: number[]): number[] {
            const formattedBitmap: number[] = [0];

            bitmap.forEach(i => {
                formattedBitmap.push(this.offsetDisplay(i));
                // Since the 8x8 Matrix chip can render on a 16x8 screen, we have to write an empty byte
                formattedBitmap.push(0);
            });

            return formattedBitmap;
        }

        public initializeDisplay(addr: number): void {
            this.matrixAddress = addr;

            /** 
             * Required to initialize I2C 
             * Issue: https://github.com/lancaster-university/codal-samd/issues/13
             **/
            pins.P20.setPull(PinPullMode.PullNone)
            pins.P19.setPull(PinPullMode.PullNone)

            this.sendCommand(HT16K33_COMMANDS.TURN_OSCILLATOR_ON);
            this.sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON);
            this.setBrightness(HT16K33_CONSTANTS.MAX_BRIGHTNESS);
        }


        // --------------------------- V I S U A L --------------------------------------------


        //% blockId="HT16K33_render"
        //% block="%ht16k33 render bitmap %bitmap"
        //% subcategory="dotmatrix_ht16k33"
        public render(bitmap: number[]): void {
            const formattedBitmap = this.formatBitmap(this.rotateMatrix(bitmap, HT16K33_ROTATION_DIRECTION.DEGREES_180));
            const buff = pins.createBufferFromArray(formattedBitmap);
            pins.i2cWriteBuffer(this.matrixAddress, buff, false);
        }


        /**
         * Render a message on the Dot Matrix Display.
         * @param message The message to display
         * @param addr I2C address of the HT16K33 chip
         */
        //% blockId="HT16K33_renderMessage"
        //% block="%ht16k33 render message %message"
        //% subcategory="dotmatrix_ht16k33"
        public renderMessage(message: string): void {
            // Convert the characters in the message to their corresponding bitmap representations
            const bitmap: number[] = [];
            for (let i = 0; i < message.length; i++) {
                const char = message.charAt(i);
                const charIndex = this.font.indexOf(char);
                if (charIndex !== -1) {
                    const charBitmap = this.font_matrix[charIndex];
                    for (let j = 0; j < charBitmap.length; j++) {
                        bitmap.push(charBitmap[j]);
                    }
                } else {
                    // If the character is not in the font, add an empty space
                    bitmap.push(0b00000000);
                }
            }

            // Render the bitmap on the display
            this.render(bitmap);
        }
    


        //% blockId="HT16K33_setBrightness"
        //% block="%ht16k33 set brightness %brightness"
        //% brightness.min=0 brightness.max=15
        //% subcategory="dotmatrix_ht16k33"
        public setBrightness(brightness: number): void {
            this.sendCommand(HT16K33_COMMANDS.SET_BRIGHTNESS | (brightness & HT16K33_CONSTANTS.MAX_BRIGHTNESS));
        }

        //% blockId="HT16K33_setBlinkRate"
        //% block="%ht16k33 set blink rate %rate"
        //% rate.min=0 rate.max=3
        //% subcategory="dotmatrix_ht16k33"
        public setBlinkRate(rate: number): void {
            this.sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON | ((rate & HT16K33_CONSTANTS.MAX_BLINK_RATE) << 1));
        }
    }

    /**
     * Create a HT16K33 object.
     */
    //% blockId="HT16K33_create"
    //% block="Create Dot Matrix Display at I2C addr %addr"
    //% subcategory="dotmatrix_ht16k33"
    //% addr.defl=0x70
    export function create(addr: number): HT16K33 {
        let ht16k33 = new HT16K33();
        ht16k33.initializeDisplay(addr);
        return new HT16K33();
    }
}
