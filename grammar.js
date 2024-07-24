module.exports = grammar({
	name: "citrus",
	rules: {
		source_file: $ => repeat(seq($.definition, ";")),
    definition: $ => choice(
      $.type_def,
      $.extern_def,
      $.let,
    ),
    type_def: $ => choice(
      $.alias,
      $.struct_def,
      $.enum_def,
    ),
    alias: $ => seq(
      "alias",
      alias($.ident, $.typename),
      "=",
      $.type,
    ),
    ident: $ => /([a-z_])+/,

    type: $ => choice(
      $.array_type,
      $.ident,
      $.fn_type
    ),
    array_type: $ => seq(
      "[",
      $.type,
      "]"
    ),
    fn_type: $ => seq(
      "fn","(",
      repeat($.type),
      ")",
      ":",
      $.type
    ),
    extern_def: $ => seq(
      "extern",
      $.ident,
      ":",
      $.type,
    ),
    struct_def: $ => seq(
      "type",
      alias($.ident, $.typename),
      "=",
      "{",
        seq($.annotated_ident, optional(repeat(seq(",", $.annotated_ident))), optional(",")),
      "}"
    ),
    annotated_ident: $ => seq($.ident, ":", $.type),
    enum_def: $ => seq(
      "type",
      alias($.ident, $.typename),
      "=",
      "[",
        seq($.ident, optional(repeat(seq(",", $.ident))), optional(",")),
      "]"
    ),
    let: $ => seq(
      "let",
      $.ident,
      "=",
      $.expr
    ),
    expr: $ => choice(
      $.literal,
      $.binary_op,
      $.ident,
      $.let,
      $.functioncall,
      $.ifelse,
    ),
    functioncall : $ => seq(
      $.ident,
      "(",
      optional(seq($.expr, optional(repeat(seq(",", $.expr))), optional(","))),
      ")"
    ),
    ifelse: $ => seq(
      "if",
      $.expr,
      $.block,
      "else",
      $.block
    ),
    binary_op: $ => prec.left(1, seq(
      $.expr,
      choice(
        "+",
        "*",
        "/",
        "-",
        "||",
        "&&",
        "<",
        ">",
        ">=",
        "<=",
      ),
      $.expr
    )),
    literal: $ => choice(
      $.number,
      $.function,
      $.string,
      $.bool,
      $.array
    ),
    array: $ => seq("[",
      optional(seq($.expr, optional(repeat(seq(",", $.expr))), optional(","))),
      "]"),
    string: $ => /(".+")/,
    bool: $ => choice(
      "true",
      "false"
    ),
    function: $ => seq(
      "fn","(",
      optional(seq($.annotated_ident, optional(repeat(seq(",", $.annotated_ident))), optional(","))),
      ")",
      optional(seq(":", $.type)),
      $.block
    ),
    number: $ => /([0-9]+)/,
    block: $ => seq("{",seq($.expr, optional(repeat(seq(";", $.expr))), optional(";")), "}"),
	}
});
