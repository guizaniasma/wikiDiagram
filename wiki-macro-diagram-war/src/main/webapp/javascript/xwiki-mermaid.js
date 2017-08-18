/**
 * Copyright (C) 2017 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

(function($, mermaidJS) {

  var B64 = {
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      lookup: null,
      ie: /MSIE /.test(navigator.userAgent),
      ieo: /MSIE [67]/.test(navigator.userAgent),
      encode: function (s) {
          /* jshint bitwise:false */
          var buffer = B64.toUtf8(s),
              position = -1,
              result,
              len = buffer.length,
              nan0, nan1, nan2, enc = [, , , ];
          
          if (B64.ie) {
              result = [];
              while (++position < len) {
                  nan0 = buffer[position];
                  nan1 = buffer[++position];
                  enc[0] = nan0 >> 2;
                  enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                  if (isNaN(nan1))
                      enc[2] = enc[3] = 64;
                  else {
                      nan2 = buffer[++position];
                      enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                      enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                  }
                  result.push(B64.alphabet.charAt(enc[0]), B64.alphabet.charAt(enc[1]), B64.alphabet.charAt(enc[2]), B64.alphabet.charAt(enc[3]));
              }
              return result.join('');
          } else {
              result = '';
              while (++position < len) {
                  nan0 = buffer[position];
                  nan1 = buffer[++position];
                  enc[0] = nan0 >> 2;
                  enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                  if (isNaN(nan1))
                      enc[2] = enc[3] = 64;
                  else {
                      nan2 = buffer[++position];
                      enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                      enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                  }
                  result += B64.alphabet[enc[0]] + B64.alphabet[enc[1]] + B64.alphabet[enc[2]] + B64.alphabet[enc[3]];
              }
              return result;
          }
      },
      decode: function (s) {
          /* jshint bitwise:false */
          s = s.replace(/\s/g, '');
          if (s.length % 4)
              throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
          if(/[^A-Za-z0-9+\/=\s]/g.test(s))
              throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');

          var buffer = B64.fromUtf8(s),
              position = 0,
              result,
              len = buffer.length;

          if (B64.ieo) {
              result = [];
              while (position < len) {
                  if (buffer[position] < 128)
                      result.push(String.fromCharCode(buffer[position++]));
                  else if (buffer[position] > 191 && buffer[position] < 224)
                      result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
                  else
                      result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
              }
              return result.join('');
          } else {
              result = '';
              while (position < len) {
                  if (buffer[position] < 128)
                      result += String.fromCharCode(buffer[position++]);
                  else if (buffer[position] > 191 && buffer[position] < 224)
                      result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
                  else
                      result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
              }
              return result;
          }
      },
      toUtf8: function (s) {
          /* jshint bitwise:false */
          var position = -1,
              len = s.length,
              chr, buffer = [];
          if (/^[\x00-\x7f]*$/.test(s)) while (++position < len)
              buffer.push(s.charCodeAt(position));
          else while (++position < len) {
              chr = s.charCodeAt(position);
              if (chr < 128)
                  buffer.push(chr);
              else if (chr < 2048)
                  buffer.push((chr >> 6) | 192, (chr & 63) | 128);
              else
                  buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
          }
          return buffer;
      },
      fromUtf8: function (s) {
          /* jshint bitwise:false */
          var position = -1,
              len, buffer = [],
              enc = [, , , ];
          if (!B64.lookup) {
              len = B64.alphabet.length;
              B64.lookup = {};
              while (++position < len)
                  B64.lookup[B64.alphabet.charAt(position)] = position;
              position = -1;
          }
          len = s.length;
          while (++position < len) {
              enc[0] = B64.lookup[s.charAt(position)];
              enc[1] = B64.lookup[s.charAt(++position)];
              buffer.push((enc[0] << 2) | (enc[1] >> 4));
              enc[2] = B64.lookup[s.charAt(++position)];
              if (enc[2] === 64)
                  break;
              buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
              enc[3] = B64.lookup[s.charAt(++position)];
              if (enc[3] === 64)
                  break;
              buffer.push(((enc[2] & 3) << 6) | enc[3]);
          }
          return buffer;
      }
  };
  $(document).ready(function(){
    setTimeout(function() {
      // Delete and re add the mermaid node from the DOM
      $(".mermaid-diagram").each(function(i, mermaidholder) {
        var mermaidsyntax = $(mermaidholder).attr("wikiparam");
        mermaid.parseError = function(err,hash){
          console.log(err);
          $(mermaidholder).html("[[ " + err + "]]");
          $(mermaidholder).addClass("error");
          $(mermaidholder).removeClass("hidden");
        };
        if (mermaidsyntax && mermaid.parse(mermaidsyntax)) {
          var mermaidnode = document.createElement('div');
          mermaidnode.className = 'mermaid';
          mermaidnode.appendChild(document.createTextNode(mermaidsyntax));
          mermaidholder.appendChild(mermaidnode);
          mermaid.init(); // jshint ignore:line
          var svg = document.querySelector('svg').outerHTML;
          svglink = 'data:image/svg+xml;base64,' + B64.encode(svg);
          $(mermaidholder).html("<img src='" + svglink + "' width='100%' class='clearboth'/>");
          $(mermaidholder).removeClass("hidden");
        }
      });
    }, 1000);
  });

})(jQuery, mermaidJS);
