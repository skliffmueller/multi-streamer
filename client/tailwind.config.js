module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    plugins: [],
    theme: {
        extend: {
            colors: {
                'opaque': {
                    50:'rgba(0,0,0,0.05)',
                    100:'rgba(0,0,0,0.1)',
                    200:'rgba(0,0,0,0.2)',
                    300:'rgba(0,0,0,0.3)',
                    400:'rgba(0,0,0,0.4)',
                    500:'rgba(0,0,0,0.5)',
                    600:'rgba(0,0,0,0.6)',
                    700:'rgba(0,0,0,0.7)',
                    800:'rgba(0,0,0,0.8)',
                    900:'rgba(0,0,0,0.9)',
                },
            },
            height: {
                '68px': '68px',
                'maxv': '40rem',
            },
            maxHeight: {
                'maxv': '40rem',
            },
            width: {
                '120px': '120px',
                'maxv': '26rem'
            },
            maxWidth: {
                'maxv': '26rem'
            }
        }
    }
}
