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
        public matrixAddress: number;

        constructor() {
            this.matrixAddress = HT16K33_CONSTANTS.DEFAULT_ADDRESS;
        }

        private sendCommand(command: HT16K33_COMMANDS): void {
            pins.i2cWriteNumber(this.matrixAddress, 0, NumberFormat.Int8LE, false);
            pins.i2cWriteNumber(this.matrixAddress, command, NumberFormat.Int8LE, false);
        }

        private rotateMatrix(matrix: number[], rotationDirection: HT16K33_ROTATION_DIRECTION): number[] {
            const rows = matrix.length;
            const cols = 1; // For a one-dimensional array
            const rotatedMatrix: number[] = [];

            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    const index = row * cols + col;
                    switch (rotationDirection) {
                        case HT16K33_ROTATION_DIRECTION.CLOCKWISE:
                            rotatedMatrix[index] = matrix[(rows - row - 1) * cols + col];
                            break;
                        case HT16K33_ROTATION_DIRECTION.COUNTER_CLOCKWISE:
                            rotatedMatrix[index] = matrix[row * cols + (cols - col - 1)];
                            break;
                        case HT16K33_ROTATION_DIRECTION.DEGREES_180:
                            rotatedMatrix[index] = matrix[(rows - row - 1) * cols + (cols - col - 1)];
                            break;
                        default:
                            break;
                    }
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

        //% blockId="HT16K33_RENDER_BITMAP"
        //% block="%ht16k33 render bitmap %bitmap"
        //% subcategory="dotmatrix_ht16k33"
        public render(bitmap: number[]): void {
            const formattedBitmap = this.formatBitmap(this.rotateMatrix(bitmap, HT16K33_ROTATION_DIRECTION.DEGREES_180));
            const buff = pins.createBufferFromArray(formattedBitmap);
            pins.i2cWriteBuffer(this.matrixAddress, buff, false);
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

        //% blockId="HT16K33_SET_BRIGHTNESS"
        //% block="%ht16k33 set brightness %brightness"
        //% brightness.min=0 brightness.max=15
        //% subcategory="dotmatrix_ht16k33"
        public setBrightness(brightness: number): void {
            this.sendCommand(HT16K33_COMMANDS.SET_BRIGHTNESS | (brightness & HT16K33_CONSTANTS.MAX_BRIGHTNESS));
        }

        //% blockId="HT16K33_SET_BLINK_RATE"
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
    export function create(addr: number): HT16K33 {
        let ht16k33 = new HT16K33();
        ht16k33.initializeDisplay(addr);
        return new HT16K33();
    }
}
