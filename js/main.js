var App = (function(){
    var db = localStorage;
    var initialized = false;

    function initialize() {	
        if (!initialized){			
            setupListView();
            bindEvents()
            populateStudiosList( getStudios() );
        } 
        initialized = true;
    }

    function setupListView() {
        var ListItemView = function(){
            this.el = $("<li/>");
        };

        var ListView = function(el){
            this.el = $(el);
        }; 

        ListView.prototype.refreshList = function(studios){ 
            listView = this;
            listView.el.html('');
            listView.el.hide();
            listView.addItems(studios);
            listView.el.fadeIn('slow');
        };

        ListView.prototype.addItems = function(items) {
            listView = this;
            $.each(items,function(i,item){
                var listItemView = new ListItemView();
                listItemView.el.html(item.title); 
                listView.el.append(listItemView.el);
            });
        };

        studiosListView = new ListView(".main ul"); 
    }

    function bindEvents() {
        $("a#sync").on('click',sync);
        $("a#clear").on('click',clear);        
    }

    function resetDb() {
    	db.setItem("studios", JSON.stringify({ studios: [] }));
    }

    function populateStudiosList(studios) {
        studiosListView.refreshList( studios );
    }

    function populateStudiosListFromLocalStorage(){
        studiosListView.refreshList(getStudios().studios);    
    }
    
    function getStudios() {
    	return JSON.parse(db.getItem("studios")) || [];
    }

    function addStudiosToLocalStorage(studios) {
    	db.setItem("studios", JSON.stringify(studios));
    };

    function sync() { 
    	var url = "http://yoga-now-api.herokuapp.com/studios.json"
    	$.getJSON(url, function(studios){		
    		addStudiosToLocalStorage(studios);
    		populateStudiosList(studios);
    	});	
    }

    function clear() {
    	resetDb();
    	populateStudiosListFromLocalStorage();
    }

    return {
    	initialize: initialize,
    	getStudios: getStudios,
    	sync: sync,
    	clear: clear
    }
})();


