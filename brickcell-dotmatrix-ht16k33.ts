/**
 * makecode HT16K33 led backpack Package
 */

//% weight=100 color=#00a7e9 icon="\uf26c"
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

    enum HT16K33_ROTATION {
        NONE = 0,
        CLOCKWISE = 1,
        COUNTER_CLOCKWISE = 2,
        DEGREES_180 = 3,
        MIRROR_HORIZONTAL = 4,
        MIRROR_VERTICAL = 5
    };

    export class HT16K33 {
        private matrixAddress: number;
        private numOfMatrix: number;

        private smile: number[] = [
            60,
            66,
            165,
            129,
            165,
            153,
            66,
            60
        ]

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
            this.numOfMatrix = 1;
        }

        private sendCommand(command: HT16K33_COMMANDS): void {
            pins.i2cWriteNumber(this.matrixAddress, 0, NumberFormat.Int8LE, false);
            pins.i2cWriteNumber(this.matrixAddress, command, NumberFormat.Int8LE, false);
        }



        /**
         * Rotate matrix clockwise
         **/
        private rotateMatrixClockwise(matrix: number[]): number[] {
            const rotatedMatrix = [];
            for (let i = 0; i < 8; i++) {
                let rotatedRow = 0;
                for (let j = 0; j < 8; j++) {
                    rotatedRow |= ((matrix[j] >> i) & 1) << (7 - j);
                }
                rotatedMatrix.push(rotatedRow);
            }
            return rotatedMatrix;
        }

        /**
         * Rotate matrix counter-clockwise
         **/
        private rotateMatrixCounterClockwise(matrix: number[]): number[] {
            const rotatedMatrix = [];
            for (let i = 0; i < 8; i++) {
                let rotatedRow = 0;
                for (let j = 0; j < 8; j++) {
                    rotatedRow |= ((matrix[j] >> (7 - i)) & 1) << j;
                }
                rotatedMatrix.push(rotatedRow);
            }
            return rotatedMatrix;
        }

        /**
         * Rotate matrix 180 degrees
         **/
        private rotateMatrix180Degrees(matrix: number[]): number[] {
            const rotatedMatrix = [];

            for (let i = 7; i >= 0; i--) {
                let rotatedRow = 0;

                for (let j = 0; j < 8; j++) {
                    rotatedRow |= ((matrix[i] >> j) & 1) << (7 - j);
                }

                rotatedMatrix.push(rotatedRow);
            }

            return rotatedMatrix;
        }

        /**
         * Mirror matrix horizontal
         **/
        private mirrorMatrixHorizontal(matrix: number[]): number[] {
            const mirroredMatrix = [];
            for (const row of matrix) {
                let reversedRow = 0;
                for (let i = 0; i < 8; i++) {
                    reversedRow |= ((row >> i) & 1) << (7 - i);
                }
                mirroredMatrix.push(reversedRow);
            }
            return mirroredMatrix;
        }

        /**
         * Mirror matrix vertical
         **/
        private mirrorMatrixVertical(matrix: number[]): number[] {
            const mirroredMatrix = [];
            for (let i = 7; i >= 0; i--) {
                mirroredMatrix.push(matrix[i]);
            }
            return mirroredMatrix;
        }

        /**
         * Modify matrix according to given rotation direction
         **/
        private rotateMatrix(matrix: number[], rotationDirection: HT16K33_ROTATION): number[] {
            let modifiedMatrix = [];
            if (rotationDirection == HT16K33_ROTATION.CLOCKWISE)
                return this.rotateMatrixClockwise(matrix);
            if (rotationDirection == HT16K33_ROTATION.COUNTER_CLOCKWISE)
                return this.rotateMatrixCounterClockwise(matrix);
            if (rotationDirection == HT16K33_ROTATION.DEGREES_180)
                return this.rotateMatrix180Degrees(matrix);
            if (rotationDirection == HT16K33_ROTATION.MIRROR_HORIZONTAL)
                return this.mirrorMatrixHorizontal(matrix);
            if (rotationDirection == HT16K33_ROTATION.MIRROR_VERTICAL)
                return this.mirrorMatrixVertical(matrix);
            return matrix;
        }

        private offsetDisplay(value: number): number {
            // this seems makes sure that the digit are inside the matrix
            if (this.numOfMatrix == 1)
                return (value >> 1) | (value << 7);
            return value;
        }


        private formatBitmap(matrix1: number[], matrix2: number[]): number[] {
            /**
            * HT16K33 needs 16 columns by 8 rows data to be sent (including the 8x8 matrix)
            * Byte arrangement is as follows:
            *   [
            *   matrix1_row1, matrix2_row1,
            *   matrix1_row2, matrix2_row2,
            *   ...
            *   matrix1_row8, matrix2_row8
            *   ]
            **/
            const formattedBitmap: number[] = [0];
            for (let i = 0; i < 8; i++) {
                formattedBitmap.push(this.offsetDisplay(matrix1[i]));
                formattedBitmap.push(this.offsetDisplay(matrix2[i]));
            }
            return formattedBitmap;
        }

        /**
        * Setup HT16K33. 
        */
        //% block="%ht16k33 Setup MAX7219:|Number of matrix $num"
        //% blockId="HT16K33_setup"
        //% num.min=1 num.defl=1
        //% subcategory="dotmatrix_ht16k33"
        public setup(num: number) {
            this.numOfMatrix = num;
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
            let rotatedBitmap1: number[];
            let rotatedBitmap2: number[];

            // for 2 dot matrix (16x8), mirror horizontal
            // for 1 dot matrix  (8x8), mirror vertical
            //      then rotate counter clockwise
            if (this.numOfMatrix == 2)
                rotatedBitmap1 = this.rotateMatrix(bitmap, HT16K33_ROTATION.MIRROR_HORIZONTAL);
            else
                rotatedBitmap1 = this.rotateMatrix(bitmap, HT16K33_ROTATION.MIRROR_VERTICAL);
            rotatedBitmap2 = this.rotateMatrix(rotatedBitmap1, HT16K33_ROTATION.COUNTER_CLOCKWISE);

            let smile = [
                0b00000001,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b11000000
            ]
            
            const formattedBitmap = this.formatBitmap(rotatedBitmap2, smile);
            const buff = pins.createBufferFromArray(formattedBitmap);
            pins.i2cWriteBuffer(this.matrixAddress, buff, false);
        }


        public getFontMatrix(char: string): number[] {
            let bitmap: number[] = [];
            const charIndex = this.font.indexOf(char);
            const charBitmap = this.font_matrix[charIndex];
            for (let j = 0; j < charBitmap.length; j++) {
                bitmap[j] = charBitmap[j];
            }

            // pad 0 
            for (let k = charBitmap.length; k < 8; k++)
                bitmap[k] = 0;

            // for 2 dot matrix (16x8), mirror horizontal
            // for 1 dot matrix  (8x8), mirror vertical
            //      then rotate counter clockwise
            let mirroredBitmap: number[];
            let rotatedBitmap: number[];
            if (this.numOfMatrix == 2)
                mirroredBitmap = this.rotateMatrix(bitmap, HT16K33_ROTATION.MIRROR_HORIZONTAL);
            else
                mirroredBitmap = this.rotateMatrix(bitmap, HT16K33_ROTATION.MIRROR_VERTICAL);
            rotatedBitmap = this.rotateMatrix(mirroredBitmap, HT16K33_ROTATION.COUNTER_CLOCKWISE);
            
            
            let offsetBitmap: number[] = [];
            let byte: number = 0;
            for (let i = 0; i < rotatedBitmap.length; i++) {
                byte = rotatedBitmap[i];
                if (this.numOfMatrix == 1)
                    offsetBitmap[i] = (byte >> 1) | (byte << 7);
                offsetBitmap[i] =  byte;
            }

            return offsetBitmap;
        }

        private decimalToBinary(decimalValue: number, significantBits: number): string {
            let binaryString = '';

            for (let i = significantBits - 1; i >= 0; i--) {
                const bit = (decimalValue & (1 << i)) ? '1' : '0';
                binaryString += bit;
            }

            return binaryString;
        }

        /**
         * Render a message on the Dot Matrix Display.
         * @param message The message to display
         */
        //% blockId="HT16K33_renderMessage"
        //% block="%ht16k33 render message %message"
        //% subcategory="dotmatrix_ht16k33"
        public renderMessage(message: string): void {
            // get font matrix:
            let fontMatrix: number[][] = [];
            for (let i=0; i<message.length;i++) {
                fontMatrix[i] = this.getFontMatrix(message[i]);
            }


            let smile = [
                0b00000001,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b00000000,
                0b11000000
            ]

            let mirroredSmile = this.rotateMatrix(smile, HT16K33_ROTATION.MIRROR_HORIZONTAL);

            // Displaying the text
            let outputText = [];
            for (let row = 0; row < 8; row++) {
                let rowOutput = '';

                for (let col = 0; col < fontMatrix.length; col++) {
                    const byteValue = fontMatrix[col][row];
                    const binaryRepresentation = this.decimalToBinary(byteValue, 8);
                    const significantBits = binaryRepresentation.slice(3); // Slicing from index 3 to the end
                    rowOutput += significantBits + '0';  // '0' add space between font
                }
                outputText.push(rowOutput);
            }

            // Chunking the outputText into an array of numbers with 8 bytes each
            const chunkedOutputText = [];
            for (let i = 0; i < outputText[0].length; i += 8) {
                const chunk = outputText.map(row => parseInt(row.slice(i, i + 8), 2));
                chunkedOutputText.push(chunk);
            }

            // Final
            let chunkText2 = [];
            for (let col = 0; col < chunkedOutputText.length; col++) {
                let rowBinary = [];
                for (let row = 0; row < 8; row++) {
                    const byteValue = chunkedOutputText[col][row];
                    const binaryRepresentation = this.decimalToBinary(byteValue, 8);
                    rowBinary.push(byteValue);
                }

                chunkText2.push(rowBinary);
            }



            const formattedBitmap = this.formatBitmap(chunkText2[0], chunkText2[1]);
            const buff = pins.createBufferFromArray(formattedBitmap);
            pins.i2cWriteBuffer(this.matrixAddress, buff, false);
        }


        /**
         * Render a message on the Dot Matrix Display.
         * @param message The message to display
         * @param addr I2C address of the HT16K33 chip
         */
        //% blockId="HT16K33_renderChar"
        //% block="%ht16k33 render character %char"
        //% subcategory="dotmatrix_ht16k33"
        public renderChar(char: string): void {
            let bitmap: number[] = [];
            const charIndex = this.font.indexOf(char);
            const charBitmap = this.font_matrix[charIndex];
            for (let j = 0; j < charBitmap.length; j++) {
                bitmap[j] = charBitmap[j];
            }

            // Render the bitmap on the display
            this.clearDisplay();
            this.render(bitmap);
        }
    

        /**
         * Scroll text on the Dot Matrix Display.
         * @param text The text to scroll
         * @param delay Time delay between each scroll step in milliseconds
         */
        //% blockId="HT16K33_scrollText"
        //% block="%ht16k33 scroll text %text with delay %delay"
        //% subcategory="dotmatrix_ht16k33"
        public scrollText(text: string, delay: number): void {
            const scrollSteps = text.length + 8; // Adding extra steps for empty spaces between scrolls

            for (let step = 0; step < scrollSteps; step++) {
                let displayText = "        " + text + "        "; // Add empty spaces for scrolling effect
                displayText = displayText.substr(step, 8); // Extract the current 8-character segment
                this.renderMessage(displayText);
                basic.pause(delay);
            }
        }


        /**
         * Render all fonts on the Dot Matrix Display.
         */
        //% blockId="HT16K33_renderFonts"
        //% block="%ht16k33 render all fonts"
        //% subcategory="dotmatrix_ht16k33"
        public renderFonts(): void {
            let bitmap: number[] = [];
            
            for (let i = 0; i < this.font_matrix.length; i++) {
                for (let j = 0; j < this.font_matrix[i].length; j++) {
                    bitmap[j] = this.font_matrix[i][j];
                }
                // Render the bitmap on the display
                this.clearDisplay();
                this.render(bitmap);
                basic.pause(500);
            }
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

        //% blockId="HT16K33_clearDisplay"
        //% block="%ht16k33 clear display"
        //% subcategory="dotmatrix_ht16k33"
        public clearDisplay(): void {
            this.render([0, 0, 0, 0, 0, 0, 0, 0]);
        }

    }

    /**
     * Create a HT16K33 object.
     */
    //% blockId="HT16K33_create"
    //% block="Create Dot Matrix|at I2C addr %addr"
    //% subcategory="dotmatrix_ht16k33"
    //% addr.defl=0x70
    export function create(addr: number): HT16K33 {
        let ht16k33 = new HT16K33();
        ht16k33.initializeDisplay(addr);
        return ht16k33;
    }
}
