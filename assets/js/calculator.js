$(document).ready(() => {
    console.log('ready')
    let input_number = $('.input-number')
    let input_operator = $('.input-operator')
    let input_shift = $('.input-shift')
    let input_expression = $('#input-expression')
    let opt_caret_left = $('#opt-caret-left')
    let opt_caret_right = $('#opt-caret-right')
    let opt_del = $('#opt-del')
    let opt_reset = $('#opt-reset')
    let opt_next = $('#opt-next')
    let opt_calc = $('#opt-calc')
    let calc_result = $('#opt-calc-result')
    let copy_result = $('#copy-result')
    let swap_result = $('#opt-swap-result')

    // Result variables
    var calc_result_val = Float64Array

    function expAddExp(expression) {
        input_expression.val(input_expression.val() + expression)
        // input_expression.val($(this).val().replace(/[^a-z0-9]/gi, ''))
        console.log(input_expression.val())
        console.log(expression)
    }

    function expShiftCursor(direction) {
        input_expression.focus()
        input_expression.on("focus click", function () {
            let curr = document.getElementById('input-expression').selectionStart

            if (direction === 'left') {
                if (curr - 1 >= 0) {
                    $(this)[0].setSelectionRange(curr - 1, curr - 1)
                }
            } else if (direction === 'right') {
                if (curr + 1 <= $(this).val().length) {
                    $(this)[0].setSelectionRange(curr + 1, curr + 1)
                }
            }
        })
    }

    function copyResState(state) {
        if (state === 'normal') {
            $('#copy-result i').attr('class', 'fa fa-copy')
            $('#copy-result span').text('')
        } else if (state === 'copied') {
            $('#copy-result i').attr('class', 'fa fa-check')
            $('#copy-result span').text('  Copied!')
        }
    }

    function calculate() {
        const chars = {
            '×': '*',
            'x': '*',
            ',': '.'
        } // Chars map
        let clean_expression = input_expression.val().replaceAll(/[×x]/g, m => chars[m])
        let clean_expression_ = ""
        for (let i = 0; i < clean_expression.length; i++) {
            if (clean_expression[i] === '(' && clean_expression[i - 1] !== '*') {
                clean_expression_ += '*('
            } else if (clean_expression[i] === ')' && clean_expression[i + 1] !== '*' &&
                i < clean_expression.length - 1) {
                clean_expression_ += ')*'
            } else {
                clean_expression_ += clean_expression[i]
            }
        }
        console.log(clean_expression_)

        calc_result.text(function () {
            try {
                calc_result_val = eval(clean_expression_)
                return calc_result_val
            } catch (e) {
                return e
            }
        })
        copyResState('normal')
    }

    //
    // Fraction library
    //
    function decimalPlaces(number) {
        let numberOfPlaces = 0;
        let foundFirstZero = false;
        let foundDot = false;

        for (let i = 0; i < number.toString().length; i++) {
            if (number.toString()[i] === "0" && !foundFirstZero) {
                foundFirstZero = true;
            } else if (number.toString()[i] === ".") {
                foundDot = true;
            } else if (number.toString()[i].match(/\d+/g) != null && foundDot) {
                numberOfPlaces++;
            }
        }

        return numberOfPlaces;
    }

    function simplify(numerator, denominator) {
        let fraction = {
            numerator: numerator,
            denominator: denominator
        };

        for (let i = fraction.denominator; i > 0; i--) {
            if (fraction.denominator % i === 0 && fraction.numerator % i === 0) {
                fraction.numerator /= i;
                fraction.denominator /= i;
            }
        }

        return fraction;
    }

    // Expression adding
    input_number.click(function () {
        expAddExp($(this).val())
        calculate()
    });
    input_operator.click(function () {
        if ($(this).val() != null) {
            expAddExp($(this).val())
            calculate()
        }
    })

    // Delete operation "<-" action
    opt_del.click(() => {
        input_expression.val(function (index, value) {
            return value.substr(0, value.length - 1)
        })
    })

    // Reset operation "CE" action
    opt_reset.click(function () {
        input_expression.val("")
    })

    // Next operation "Next" action
    opt_next.click(function () {
        input_expression.val(calc_result.text())
    })

    // Calculate operation "=" action
    opt_calc.click(function () {
        calculate()
    })

    // Calculate operation based on input expression typing activity
    input_expression.on('input', function () {
        calculate()
    })

    // Calculate operation on expression "Key press" action
    input_expression.keypress(function (e) {
        let key = e.which
        if (key === 13) {
            calculate()
        }
    })

    // Copy result operation
    copy_result.click(function () {
        if (calc_result.text() !== '') {
            navigator.clipboard.writeText(calc_result.text())
            copyResState('copied')
        }
    })

    // Swap result operation
    swap_result.click(function () {
        calc_result.text(function () {
            if (calc_result.text().includes('/')) {
                return calc_result_val
            } else {
                try {
                    let nv = calc_result_val.toFixed(5)
                    let res = simplify(nv.toString().substring(2),
                        Math.pow(10, decimalPlaces(nv)))
                    return res.numerator + '/' + res.denominator
                } catch (e) {
                    return ""
                }
            }
        })
        copyResState('normal')
    })

    // Caret operation Left
    opt_caret_left.click(function () {
        expShiftCursor('left')
    })

    // Caret operation Right
    opt_caret_right.click(function () {
        expShiftCursor('right')
    })


    //
    // CSS
    //
    $('#footer p a b').hover(
        function () {
            $('#footer p a b i').attr('class', 'fa fa-github')
            $('#footer p a b').css({
                'font-family': 'Product Sans',
                'font-weight': 'bold'
            })
        },
        function () {
            $('#footer p a b i').attr('class', '')
        }
    )
})