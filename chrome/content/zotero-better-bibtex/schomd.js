// Generated by CoffeeScript 1.10.0
Zotero.BetterBibTeX.schomd = {};

Zotero.BetterBibTeX.schomd.init = function() {
  Zotero.CiteProc.CSL.Output.Formats.markdown = {
    text_escape: function(text) {
      text = text.replace(/([-"\\`\*_{}\[\]\(\)#\+!])/g, "\\$1");
      text = text.replace(/(^|[\n])(\s*[0-9]+)\.(\s)/g, "$1\\.$2");
      text = text.replace(Zotero.CiteProc.CSL.SUPERSCRIPTS_REGEXP, (function(aChar) {
        return "<sup>" + Zotero.CiteProc.CSL.SUPERSCRIPTS[aChar] + "</sup>";
      }));
      return text;
    },
    bibstart: '',
    bibend: '',
    '@font-style/italic': '_%%STRING%%_',
    '@font-style/oblique': '_%%STRING%%_',
    '@font-style/normal': false,
    '@font-variant/small-caps': '<span style="font-variant:small-caps;">%%STRING%%</span>',
    '@passthrough/true': Zotero.CiteProc.CSL.Output.Formatters.passthrough,
    '@font-variant/normal': false,
    '@font-weight/bold': '**%%STRING%%**',
    '@font-weight/normal': false,
    '@font-weight/light': false,
    '@text-decoration/none': false,
    '@text-decoration/underline': false,
    '@vertical-align/sup': '<sup>%%STRING%%</sup>',
    '@vertical-align/sub': '<sub>%%STRING%%</sub>',
    '@vertical-align/baseline': false,
    '@strip-periods/true': Zotero.CiteProc.CSL.Output.Formatters.passthrough,
    '@strip-periods/false': Zotero.CiteProc.CSL.Output.Formatters.passthrough,
    '@quotes/true': function(state, str) {
      if (str == null) {
        return state.getTerm('open-quote');
      }
      return state.getTerm('open-quote') + str + state.getTerm('close-quote');
    },
    '@quotes/inner': function(state, str) {
      if (str == null) {
        return '’';
      }
      return state.getTerm('open-inner-quote') + str + state.getTerm('close-inner-quote');
    },
    '@quotes/false': false,
    '@cite/entry': function(state, str) {
      Zotero.BetterBibTeX.debug('markdown.@cite/entry:', state.registry.registry[this.system_id].ref.id);
      return str || '';
    },
    '@bibliography/entry': function(state, str) {
      var citekey, error;
      Zotero.BetterBibTeX.debug('markdown.@bibliography/entry:', state.registry.registry[this.system_id].ref.id);
      try {
        citekey = Zotero.BetterBibTeX.keymanager.get({
          itemID: state.registry.registry[this.system_id].ref.id
        }).citekey;
      } catch (error) {
        citekey = '@@';
      }
      return "[@" + citekey + "]: #" + citekey + " \"" + (str.replace(/\\/g, '').replace(/"/g, "'")) + "\"\n<a name=\"" + citekey + "\"></a>" + str + "\n";
    },
    '@display/block': function(state, str) {
      return "\n\n" + str + "\n\n";
    },
    '@display/left-margin': function(state, str) {
      return str;
    },
    '@display/right-inline': function(state, str) {
      return str;
    },
    '@display/indent': function(state, str) {
      return "\n&nbsp;&nbsp;&nbsp;&nbsp;" + str;
    },
    '@showid/true': function(state, str, cslid) {
      return str;
    },
    '@URL/true': function(state, str) {
      return "[" + str + "](" + str + ")";
    },
    '@DOI/true': function(state, str) {
      return "[" + str + "](http://dx.doi.org/" + str + ")";
    },
    "@quotes/false": false
  };
};

Zotero.BetterBibTeX.schomd.itemIDs = function(citekeys, arg) {
  var key, keys, libraryID, resolved;
  libraryID = (arg != null ? arg : {}).libraryID;
  libraryID || (libraryID = null);
  if (!Array.isArray(citekeys)) {
    citekeys = [citekeys];
  }
  keys = (function() {
    var i, len, results1;
    results1 = [];
    for (i = 0, len = citekeys.length; i < len; i++) {
      key = citekeys[i];
      if (typeof key !== 'number') {
        results1.push(key);
      }
    }
    return results1;
  })();
  if (keys.length === 0) {
    resolved = {};
  } else {
    resolved = Zotero.BetterBibTeX.keymanager.resolve(keys, {
      libraryID: libraryID
    });
  }
  return (function() {
    var i, len, ref, results1;
    results1 = [];
    for (i = 0, len = citekeys.length; i < len; i++) {
      key = citekeys[i];
      results1.push(typeof key === 'number' ? key : ((ref = resolved[key]) != null ? ref.itemID : void 0) || null);
    }
    return results1;
  })();
};

Zotero.BetterBibTeX.schomd.citations = function(citekeys, arg) {
  var citations, cluster, clusterIDs, clusters, cp, i, item, itemID, itemIDs, j, len, len1, libraryID, ref, style, url;
  ref = arg != null ? arg : {}, style = ref.style, libraryID = ref.libraryID;
  url = "http://www.zotero.org/styles/" + (style != null ? style : 'apa');
  style = Zotero.Styles.get(url);
  cp = style.getCiteProc();
  cp.setOutputFormat('markdown');
  clusters = [];
  itemIDs = [];
  for (i = 0, len = citekeys.length; i < len; i++) {
    cluster = citekeys[i];
    clusterIDs = (function() {
      var j, len1, ref1, results1;
      ref1 = this.itemIDs(cluster, {
        libraryID: libraryID
      });
      results1 = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        item = ref1[j];
        if (item) {
          results1.push(item);
        }
      }
      return results1;
    }).call(this);
    if (clusterIDs.length !== cluster.length) {
      clusterIDs = [];
    }
    itemIDs = itemIDs.concat(clusterIDs);
    clusters.push((function() {
      var j, len1, results1;
      results1 = [];
      for (j = 0, len1 = clusterIDs.length; j < len1; j++) {
        itemID = clusterIDs[j];
        results1.push({
          id: itemID
        });
      }
      return results1;
    })());
  }
  cp.updateItems(itemIDs);
  citations = [];
  for (j = 0, len1 = clusters.length; j < len1; j++) {
    cluster = clusters[j];
    if (cluster.length === 0) {
      citations.push(null);
    } else {
      citations.push(cp.appendCitationCluster({
        citationItems: cluster,
        properties: {}
      }, true)[0][1] || null);
    }
  }
  return citations;
};

Zotero.BetterBibTeX.schomd.citation = function(citekeys, arg) {
  var citation, cp, item, itemID, itemIDs, libraryID, ref, style, url;
  ref = arg != null ? arg : {}, style = ref.style, libraryID = ref.libraryID;
  itemIDs = (function() {
    var i, len, ref1, results1;
    ref1 = this.itemIDs(citekeys, {
      libraryID: libraryID
    });
    results1 = [];
    for (i = 0, len = ref1.length; i < len; i++) {
      item = ref1[i];
      if (item) {
        results1.push(item);
      }
    }
    return results1;
  }).call(this);
  Zotero.BetterBibTeX.debug('schomd.citation', {
    citekeys: citekeys,
    style: style,
    libraryID: libraryID
  }, '->', itemIDs);
  if (itemIDs.length === 0) {
    return '';
  }
  url = "http://www.zotero.org/styles/" + (style != null ? style : 'apa');
  style = Zotero.Styles.get(url);
  cp = style.getCiteProc();
  cp.setOutputFormat('markdown');
  cp.updateItems(itemIDs);
  citation = cp.appendCitationCluster({
    citationItems: (function() {
      var i, len, results1;
      results1 = [];
      for (i = 0, len = itemIDs.length; i < len; i++) {
        itemID = itemIDs[i];
        results1.push({
          id: itemID
        });
      }
      return results1;
    })(),
    properties: {}
  }, true);
  Zotero.BetterBibTeX.debug('schomd.citation:', citekeys, '->', JSON.stringify(citation));
  citation = citation[0][1];
  return citation;
};

Zotero.BetterBibTeX.schomd.bibliography = function(citekeys, arg) {
  var bib, cp, item, itemIDs, libraryID, ref, style, url;
  ref = arg != null ? arg : {}, style = ref.style, libraryID = ref.libraryID;
  itemIDs = this.itemIDs(citekeys, {
    libraryID: libraryID
  });
  if (itemIDs.length === 0) {
    return '';
  }
  url = "http://www.zotero.org/styles/" + (style != null ? style : 'apa');
  style = Zotero.Styles.get(url);
  cp = style.getCiteProc();
  cp.setOutputFormat('markdown');
  cp.updateItems((function() {
    var i, len, results1;
    results1 = [];
    for (i = 0, len = itemIDs.length; i < len; i++) {
      item = itemIDs[i];
      if (item) {
        results1.push(item);
      }
    }
    return results1;
  })());
  bib = cp.makeBibliography();
  if (!bib) {
    return '';
  }
  return bib[0].bibstart + bib[1].join("") + bib[0].bibend;
};

Zotero.BetterBibTeX.schomd.search = function(term) {
  var creator, item, results, search;
  search = new Zotero.Search();
  search.addCondition('quicksearch-titleCreatorYear', 'contains', term, false);
  results = search.search();
  if (!results) {
    return [];
  }
  return (function() {
    var i, len, ref, results1;
    ref = Zotero.Items.get(results);
    results1 = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results1.push({
        id: item.id,
        key: item.key,
        libraryID: item.libraryID,
        libraryKey: item.libraryKey,
        title: item.getField('title'),
        date: item.getField('date'),
        extra: item.getField('callNumber'),
        creators: (function() {
          var j, len1, ref1, results2;
          ref1 = item.getCreators();
          results2 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            creator = ref1[j];
            results2.push({
              lastName: creator.ref.lastName,
              firstName: creator.ref.firstName
            });
          }
          return results2;
        })()
      });
    }
    return results1;
  })();
};

Zotero.BetterBibTeX.schomd.bibtex = function(keys, arg) {
  var deferred, displayOptions, itemIDs, items, libraryID, ref, translator;
  ref = arg != null ? arg : {}, translator = ref.translator, libraryID = ref.libraryID, displayOptions = ref.displayOptions;
  itemIDs = this.itemIDs(keys, {
    libraryID: libraryID
  });
  if (items.length === 0) {
    return '';
  }
  items = Zotero.Items.get(items);
  translator || (translator = 'betterbiblatex');
  displayOptions || (displayOptions = {});
  deferred = Q.defer();
  Zotero.BetterBibTeX.translate(Zotero.BetterBibTeX.getTranslator(translator), {
    items: items
  }, displayOptions, function(err, result) {
    if (err) {
      return deferred.reject(err);
    } else {
      return deferred.fulfill(result);
    }
  });
  return deferred.promise;
};
