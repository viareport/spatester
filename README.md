asserter
========

expect(domSelector)

vocabulaire

    .to.be
    .not.to.be

    .to.have
    .not.to.have

    .be

test :

    attr(attrName [, expectedAttrValue])
    value(expectedValue)
    text(expectedText) => check si le noeud contient le texte (n'importe où)
    checked()
    selected()
    matchSelector(selector)
    empty() => check si le noeud ne contient pas de text
    exist()
    hidden()
    visible()
    html(expectedHTML) => check si le noeud contient le code html en paramètre
    true(fn) => appel la function, passe si elle renvoie true
    false(fn) => appel la function, passe si elle renvoie false
    nodeLength(expectedNodeLength) => Nombre d'element matchant le selecteur

    les fonctions appelé par true et false recevront en paramètre
        selector => le selector passé a "expect"
