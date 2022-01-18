YUI.add("moodle-atto_linktext-button",function(n,t){var l="atto_linktext",i={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",FLAVORCONTROL:"flavorcontrol",LINK:"link",TITLE:"title",DESCRIPTION:"description"},o=".link",a=".title",r=".description";n.namespace("M.atto_linktext").Button=n.Base.create("button",n.M.editor_atto.EditorPlugin,[],{initializer:function(){this.get("disabled")||n.Array.each(["externallink"],function(t){this.addButton({icon:"ed/"+t,iconComponent:"atto_linktext",buttonName:t,callback:this._displayDialogue,callbackArgs:t})},this)},_displayDialogue:function(t,e){var i;t.preventDefault(),"400px"!==(i=this.getDialogue({headerContent:M.util.get_string("dialogtitle",l),width:"400px",focusAfterHide:e})).width&&i.set("width","400px"),t=this._getFormContent(e),(e=n.Node.create("<div></div>")).append(t),i.set("bodyContent",e),i.show(),this.markUpdated()},_getFormContent:function(t){var e=n.Handlebars.compile('<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="mdl-align"><label for="{{elementid}}_{{LINK}}">{{get_string "enterlink" component}}</label><input class="{{CSS.LINK}}" id="{{elementid}}_{{LINK}}" name="{{elementid}}_{{LINK}}" value="{{defaultlink}}" /><br /><label for="{{elementid}}_{{TITLE}}">{{get_string "entertitle" component}}</label><input class="{{CSS.TITLE}}" id="{{elementid}}_{{TITLE}}" name="{{elementid}}_{{TITLE}}" value="" /><br /><label for="{{elementid}}_{{description}}">{{get_string "enterdesc" component}}</label><input class="{{CSS.DESCRIPTION}}" id="{{elementid}}_{{description}}" name="{{elementid}}_{{description}}" value="" /><br /><button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button></div>icon: {{clickedicon}}</form>'),e=n.Node.create(e({elementid:this.get("host").get("elementid"),CSS:i,FLAVORCONTROL:"linktext_flavor",component:l,defaultlink:this.get("defaultlink"),clickedicon:t}));return this._form=e,this._form.one("."+i.INPUTSUBMIT).on("click",this._doInsert,this),e},_doInsert:function(t){var e,i,n;t.preventDefault(),this.getDialogue({focusAfterHide:null}).hide(),e=this._form.one(o),i=this._form.one(a),n=this._form.one(r),t=i.get("value"),e.get("value")&&(i.get("value")||(t=e.get("value")),t="<a href='http://"+e.get("value")+"' target='_blank' title='"+n.get("value")+"'>"+t+"</a>",this.editor.focus(),this.get("host").insertContentAtFocusPoint(t),this.markUpdated())}},{ATTRS:{disabled:{value:!1},usercontextid:{value:null},defaultlink:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});