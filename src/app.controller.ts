import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
    @Get('/')
    getHome() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>E-commerce API</title>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: #fff;
                    animation: fadeIn 2s ease-in-out;
                }

                h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                    animation: fadeIn 1s ease-in-out;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>E-commerce API</h1>
            </div>
        </body>
        </html>
    `
    }
}
