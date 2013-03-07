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
        }
        var ListView = function(el){
            this.el = $(el);
        }   

        ListView.prototype.refreshList = function(studios){ 
            listView = this;
            listView.el.html('');
            listView.el.hide();
        
            $.each(studios,function(i,studio){
                var listItemView = new ListItemView();
                listItemView.el.html(studio.title); 
                listView.el.append(listItemView.el);
            });
    
            listView.el.fadeIn('slow');
        }

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


