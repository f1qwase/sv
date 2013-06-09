(function(b){b.widget("ui.tagit",{options:{allowDuplicates:!1,caseSensitive:!0,fieldName:"tags",placeholderText:null,readOnly:!1,removeConfirmation:!1,tagLimit:null,availableTags:[],autocomplete:{},showAutocompleteOnFocus:!1,allowSpaces:!1,singleField:!1,singleFieldDelimiter:",",singleFieldNode:null,animate:!0,tabIndex:null,beforeTagAdded:null,afterTagAdded:null,beforeTagRemoved:null,afterTagRemoved:null,onTagClicked:null,onTagLimitExceeded:null,onTagAdded:null,onTagRemoved:null,tagSource:null},_create:function(){var a=
this;this.element.is("input")?(this.tagList=b("<ul></ul>").insertAfter(this.element),this.options.singleField=!0,this.options.singleFieldNode=this.element,this.element.css("display","none")):this.tagList=this.element.find("ul, ol").andSelf().last();this.tagInput=b('<input type="text" />').addClass("ui-widget-content");this.options.readOnly&&this.tagInput.attr("disabled","disabled");this.options.tabIndex&&this.tagInput.attr("tabindex",this.options.tabIndex);this.options.placeholderText&&this.tagInput.attr("placeholder",
this.options.placeholderText);this.options.autocomplete.source||(this.options.autocomplete.source=function(a,c){var d=a.term.toLowerCase(),e=b.grep(this.options.availableTags,function(a){return 0===a.toLowerCase().indexOf(d)});this.options.allowDuplicates||(e=this._subtractArray(e,this.assignedTags()));c(e)});this.options.showAutocompleteOnFocus&&(this.tagInput.focus(function(){a._showAutocomplete()}),"undefined"===typeof this.options.autocomplete.minLength&&(this.options.autocomplete.minLength=0));
b.isFunction(this.options.autocomplete.source)&&(this.options.autocomplete.source=b.proxy(this.options.autocomplete.source,this));b.isFunction(this.options.tagSource)&&(this.options.tagSource=b.proxy(this.options.tagSource,this));this.tagList.addClass("tagit").addClass("ui-widget ui-widget-content ui-corner-all").append(b('<li class="tagit-new"></li>').append(this.tagInput)).click(function(c){var d=b(c.target);d.hasClass("tagit-label")?(d=d.closest(".tagit-choice"),d.hasClass("removed")||a._trigger("onTagClicked",
c,{tag:d,tagLabel:a.tagLabel(d)})):a.tagInput.focus()});var d=!1;if(this.options.singleField)if(this.options.singleFieldNode){var c=b(this.options.singleFieldNode),e=c.val().split(this.options.singleFieldDelimiter);c.val("");b.each(e,function(b,c){a.createTag(c,null,!0);d=!0})}else this.options.singleFieldNode=b('<input type="hidden" style="display:none;" value="" name="'+this.options.fieldName+'" />'),this.tagList.after(this.options.singleFieldNode);d||this.tagList.children("li").each(function(){b(this).hasClass("tagit-new")||
(a.createTag(b(this).text(),b(this).attr("class"),!0),b(this).remove())});this.tagInput.keydown(function(c){if(c.which==b.ui.keyCode.BACKSPACE&&""===a.tagInput.val()){var d=a._lastTag();!a.options.removeConfirmation||d.hasClass("remove")?a.removeTag(d):a.options.removeConfirmation&&d.addClass("remove ui-state-highlight")}else a.options.removeConfirmation&&a._lastTag().removeClass("remove ui-state-highlight");if(c.which===b.ui.keyCode.COMMA||c.which===b.ui.keyCode.ENTER||c.which==b.ui.keyCode.TAB&&
""!==a.tagInput.val()||c.which==b.ui.keyCode.SPACE&&!0!==a.options.allowSpaces&&('"'!=b.trim(a.tagInput.val()).replace(/^s*/,"").charAt(0)||'"'==b.trim(a.tagInput.val()).charAt(0)&&'"'==b.trim(a.tagInput.val()).charAt(b.trim(a.tagInput.val()).length-1)&&0!==b.trim(a.tagInput.val()).length-1))c.which===b.ui.keyCode.ENTER&&""===a.tagInput.val()||c.preventDefault(),a.tagInput.data("autocomplete-open")||a.createTag(a._cleanedInput())}).blur(function(){a.tagInput.data("autocomplete-open")||a.createTag(a._cleanedInput())});
if(this.options.availableTags||this.options.tagSource||this.options.autocomplete.source)c={select:function(b,c){a.createTag(c.item.value);return!1}},b.extend(c,this.options.autocomplete),c.source=this.options.tagSource||c.source,this.tagInput.autocomplete(c).bind("autocompleteopen",function(){a.tagInput.data("autocomplete-open",!0)}).bind("autocompleteclose",function(){a.tagInput.data("autocomplete-open",!1)})},_cleanedInput:function(){return b.trim(this.tagInput.val().replace(/^"(.*)"$/,"$1"))},
_lastTag:function(){return this.tagList.find(".tagit-choice:last:not(.removed)")},_tags:function(){return this.tagList.find(".tagit-choice:not(.removed)")},assignedTags:function(){var a=this,d=[];this.options.singleField?(d=b(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter),""===d[0]&&(d=[])):this._tags().each(function(){d.push(a.tagLabel(this))});return d},_updateSingleTagsField:function(a){b(this.options.singleFieldNode).val(a.join(this.options.singleFieldDelimiter)).trigger("change")},
_subtractArray:function(a,d){for(var c=[],e=0;e<a.length;e++)-1==b.inArray(a[e],d)&&c.push(a[e]);return c},tagLabel:function(a){return this.options.singleField?b(a).find(".tagit-label:first").text():b(a).find("input:first").val()},_showAutocomplete:function(){this.tagInput.autocomplete("search","")},_findTagByLabel:function(a){var d=this,c=null;this._tags().each(function(){if(d._formatStr(a)==d._formatStr(d.tagLabel(this)))return c=b(this),!1});return c},_isNew:function(a){return!this._findTagByLabel(a)},
_formatStr:function(a){return this.options.caseSensitive?a:b.trim(a.toLowerCase())},_effectExists:function(a){return Boolean(b.effects&&(b.effects[a]||b.effects.effect&&b.effects.effect[a]))},createTag:function(a,d,c){var e=this;a=b.trim(a);this.options.preprocessTag&&(a=this.options.preprocessTag(a));if(""===a)return!1;if(!this.options.allowDuplicates&&!this._isNew(a))return a=this._findTagByLabel(a),!1!==this._trigger("onTagExists",null,{existingTag:a,duringInitialization:c})&&this._effectExists("highlight")&&
a.effect("highlight"),!1;if(this.options.tagLimit&&this._tags().length>=this.options.tagLimit)return this._trigger("onTagLimitExceeded",null,{duringInitialization:c}),!1;var g=b(this.options.onTagClicked?'<a class="tagit-label"></a>':'<span class="tagit-label"></span>').text(a),f=b("<li></li>").addClass("tagit-choice ui-widget-content ui-state-default ui-corner-all").addClass(d).append(g);this.options.readOnly?f.addClass("tagit-choice-read-only"):(f.addClass("tagit-choice-editable"),d=b("<span></span>").addClass("ui-icon ui-icon-close"),
d=b('<a><span class="text-icon">\u00d7</span></a>').addClass("tagit-close").append(d).click(function(){e.removeTag(f)}),f.append(d));this.options.singleField||(g=g.html(),f.append('<input type="hidden" style="display:none;" value="'+g+'" name="'+this.options.fieldName+'" />'));!1!==this._trigger("beforeTagAdded",null,{tag:f,tagLabel:this.tagLabel(f),duringInitialization:c})&&(this.options.singleField&&(g=this.assignedTags(),g.push(a),this._updateSingleTagsField(g)),this._trigger("onTagAdded",null,
f),this.tagInput.val(""),this.tagInput.parent().before(f),this._trigger("afterTagAdded",null,{tag:f,tagLabel:this.tagLabel(f),duringInitialization:c}),this.options.showAutocompleteOnFocus&&!c&&setTimeout(function(){e._showAutocomplete()},0))},removeTag:function(a,d){d="undefined"===typeof d?this.options.animate:d;a=b(a);this._trigger("onTagRemoved",null,a);if(!1!==this._trigger("beforeTagRemoved",null,{tag:a,tagLabel:this.tagLabel(a)})){if(this.options.singleField){var c=this.assignedTags(),e=this.tagLabel(a),
c=b.grep(c,function(a){return a!=e});this._updateSingleTagsField(c)}if(d){a.addClass("removed");var c=this._effectExists("blind")?["blind",{direction:"horizontal"},"fast"]:["fast"],g=this;c.push(function(){a.remove();g._trigger("afterTagRemoved",null,{tag:a,tagLabel:g.tagLabel(a)})});a.fadeOut("fast").hide.apply(a,c).dequeue()}else a.remove(),this._trigger("afterTagRemoved",null,{tag:a,tagLabel:this.tagLabel(a)})}},removeTagByLabel:function(a,b){var c=this._findTagByLabel(a);if(!c)throw"No such tag exists with the name '"+
a+"'";this.removeTag(c,b)},removeAll:function(){var a=this;this._tags().each(function(b,c){a.removeTag(c,!1)})}})})(jQuery);