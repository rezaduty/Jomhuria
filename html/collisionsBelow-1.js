define([
    'lib/domStuff'
  , 'lib/typoStuff'
], function(
    domStuff
  , typoStuff
){
    "use strict";
    /*global document:true*/

    var Glyph = typoStuff.Glyph
      , zwj = typoStuff.zwj
      , zwnj = typoStuff.zwnj
      , nbsp = typoStuff.nbsp
      , hasChar = typoStuff.hasChar
      , createElement = domStuff.createElement
      , makeTable = domStuff.makeTable
      , makeTableHead = domStuff.makeTableHead
      ;
    var first = [
            'uni0680.init'
          , 'uni0776.init'
          , 'uni06CE.init'
          , 'uni0775.init'
          , 'uni06BD.init'
          , 'uni064A.init'
          , 'uni067E.init'
          , 'uni0753.init'
          , 'uni0752.init'
          , 'uni063D.init'
          , 'uni0754.init'
          , 'uni06D1.init'
          , 'uni06CC.init'
          , 'uni0767.init'
          , 'uni0680.medi'
          , 'uni0776.medi'
          , 'uni0750.medi'
          , 'uni06CE.medi'
          , 'uni0775.medi'
          , 'uni06BD.medi'
          , 'uni064A.medi'
          , 'uni067E.medi'
          , 'uni0753.medi'
          , 'uni0752.medi'
          , 'uni063D.medi'
          , 'uni0754.medi'
          , 'uni06D1.medi'
          , 'uni06CC.medi'
          , 'uni0767.medi'
          , 'uni0680.init_High'
          , 'uni0776.init_High'
          , 'uni0750.init_High'
          , 'uni06CE.init_High'
          , 'uni0775.init_High'
          , 'uni06BD.init_High'
          , 'uni064A.init_High'
          , 'uni067E.init_High'
          , 'uni0753.init_High'
          , 'uni0752.init_High'
          , 'uni063D.init_High'
          , 'uni0754.init_High'
          , 'uni06D1.init_High'
          , 'uni06CC.init_High'
          , 'uni0767.init_High'
          , 'uni0680.medi_High'
          , 'uni0776.medi_High'
          , 'uni0750.medi_High'
          , 'uni06CE.medi_High'
          , 'uni0775.medi_High'
          , 'uni06BD.medi_High'
          , 'uni064A.medi_High'
          , 'uni067E.medi_High'
          , 'uni0753.medi_High'
          , 'uni0752.medi_High'
          , 'uni063D.medi_High'
          , 'uni0754.medi_High'
          , 'uni06D1.medi_High'
          , 'uni06CC.medi_High'
          , 'uni0767.medi_High'
          , 'uni064A.init_BaaYaaIsol'
          , 'uniFEF3'
          , 'u1EE29'
          , 'uniFB58'
          , 'uniFB5C'
          , 'uniFBFE'
    ].map(Glyph.factory)
    , second = [
            'uni0647.medi'
          , 'uni06C1.medi'
          , 'uni0777.fina'
          , 'uni06D1.fina'
          , 'uni0775.fina'
          , 'uni063F.fina'
          , 'uni0678.fina'
          , 'uni063D.fina'
          , 'uni063E.fina'
          , 'uni06D0.fina'
          , 'uni0649.fina'
          , 'uni0776.fina'
          , 'uni06CD.fina'
          , 'uni06CC.fina'
          , 'uni0626.fina'
          , 'uni0620.fina'
          , 'uni064A.fina'
          , 'uni06CE.fina'
          , 'uni077B.fina'
          , 'uni077A.fina'
          , 'uni06D2.fina'
          , 'uni06FF.medi'
          , 'uni077B.fina_PostToothFina'
          , 'uni077A.fina_PostToothFina'
          , 'uni06D2.fina_PostToothFina'
          , 'uni0625.fina'
          , 'uni0673.fina'
          , 'uniFBA9'
          , 'uniFBAF'
          , 'uniFBE5'
          , 'uniFBFD'
          , 'uniFC10'
          , 'uniFC90'
          , 'uniFD17'
          , 'uniFD18'
          , 'uniFE8A'
          , 'uniFEF0'
          , 'uniFEF2'
    ].map(Glyph.factory)
      // second "if they have vowels"
      // TODO: need to comprehend
    , secondWithVowl = [
            'aAlf.fina'
          , 'uni0625.fina'
          , 'uni0627.fina'
          , 'uni0774.fina'
          , 'uni0773.fina'
          , 'uni0623.fina'
          , 'uni0622.fina'
          , 'uni0675.fina'
          , 'uni0672.fina'
          , 'uni0673.fina'
          , 'uni0671.fina'
          , 'uniFB51'
          , 'uniFE82'
          , 'uniFE84'
          , 'uniFE88'
          , 'uniFE8E'
          , 'u1EE6F'
        ].map(Glyph.factory)
      ;

    function toString(item) {
        return item + '';
    }
    function booleanFilter(item) {
        return !!item;
    }

    function getGlyphInContext(glyph, cantDoChar) {
        var typeContexts = {
                'init': function(char){return [zwnj, char, zwj, zwnj].join('');}
              , 'medi': function(char){return [zwnj, zwj, char, zwj, zwnj].join('');}
              , 'fina': function(char){return [zwnj, zwj, char, zwnj].join('');}
              , '_nocontext_': function(char){return [zwnj, char, zwnj].join('');}
            }
          , type = glyph.getType('_nocontext_')
          , nope = cantDoChar || null
          ;
        return (type in typeContexts
                    ? typeContexts[type](glyph.char)
                    : nope
               );
    }

    var colCount = 7;
    function makeGlyphRow(glyph) {
        return [ glyph.name
               , glyph.code
               , glyph.char
               , glyph.type
               , getGlyphInContext(glyph, '—')
               , glyph.mainType, glyph.subType
            ].map(toString);
    }

    function prepareGroup(data) {
        return data.map(makeGlyphRow);
    }

    function combineWith(secondGlyphs, firstGlyph) {
        var type
          , firstTypeContexts = {
                'init': function(char){return [zwnj, char];}
              , 'medi': function(char){return [zwnj, zwj, char];}
              , '_nocontext_': function(char){return [zwnj, char];}
            }
          , secondTypeContexts = {
                'medi': function(char){return [char, zwj, zwnj];}
              , 'fina': function(char){return [char, zwnj];}
              , '_nocontext_': function(char){return [char, zwnj];}
            }
          , data
          , getContext = function(contexts, glyph) {
                var type = glyph.getType('_nocontext_');
                if(!glyph.hasChar() || !(type in contexts))
                    return [false, glyph];
                return [true, glyph, contexts[type](glyph.char)];
            }
          , combine = function(firstContext, secondContext) {
                var first, second, result;
                if(!secondContext[0])
                    return createElement('td', {dir:'LTR', colspan: 3},
                        '(no context for '+ secondContext[1].name +')');
                first = firstContext[2];
                second = secondContext[2];
                return [
                    // the names of the glyphs used
                    createElement('td', {dir:'LTR'}, [
                            firstContext[1].name
                          , createElement('sup', null, '(first)')
                          , ' + '
                          , secondContext[1].name
                          , createElement('sup', null, '(second)')
                    ])
                    // this should render the real combination:
                  , createElement('td', {dir:'RTL'}, first.concat(second).join(''))
                    // what the content is made of
                  , createElement('td', {dir:'RTL'}, first.concat(
                            [zwj, nbsp, '+', nbsp, zwj], second).join(''))
                  //, createElement('td', {dir:'LTR'}, createElement('pre',
                  //          null, JSON.stringify(secondContext[1])))
                ];
            }
          , combinations
          , content
          , first = getContext(firstTypeContexts, firstGlyph)
          ;
        if(!first[0]) {
            return createElement('div', null, createElement('h2', {dir:'LTR'}
                    , 'skipping: ' + firstGlyph.name + '(no context)'));
        }
        combinations = secondGlyphs
            .map(getContext.bind(null, secondTypeContexts))
            .map(combine.bind(null, first))
            .map(createElement.bind(null, 'tr', null))
            ;
        if(!combinations.length) {
            return createElement('div', null, createElement('h2', {dir:'LTR'}
                    , 'skipping: ' + firstGlyph.name + '(no combinations)'));
        }
        combinations.unshift(createElement('caption', null, firstGlyph.name));
        return createElement('table', {dir:'LTR', 'class': 'testcontent'}, combinations);
    }

    function main() {
        var body = createElement('article', null, [
            createElement('h1', null, 'Colisions below the baseline')
          , createElement('p', null, 'The middle column should show no collisions.')
          , createElement('p', null, '"(no context..." means that it is not straight forward to '
                                    + 'use these glyphs in a generated context')
          , createElement('p', null, 'Note that uniF{xxx} and u{xxxx} glyphs are not meant to '
                                    +'join properly with uni0{xxx} glyphs.')

        ]);

        first.map(combineWith.bind(null, second))
            .filter(booleanFilter)
            .forEach(body.appendChild, body);
        return body;
    }
    return {
        title: 'issue#6 1'
      , generate: main
    };
});
