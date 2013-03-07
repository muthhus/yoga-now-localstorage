var ListView = function(el){
    this.el = $(el);
}; 

ListView.prototype.refreshList = function(studios){     
    this.el.html('');
    this.el.hide();
    this.addItems(studios);
    this.el.fadeIn('slow');
};

ListView.prototype.addItems = function(items) {        
    $.each(items,$.proxy(function(i,item){
        this.addItem(item);
    },this));  
};

ListView.prototype.addItem = function(item){
    if (item.title) {
        this.el.append($("<li/>").html(item.title));
    }
}

var App = (function(){
    var db = localStorage;

    function initialize() {	
        studiosListView = new ListView(".main ul");
        bindEvents();
        populateStudiosList(getStudiosFromLocalStorage());
    }

    function bindEvents() {
        $("a#sync").on('click',sync);
        $("a#clear").on('click',clear);        
    }

    function populateStudiosList(studios) {
        studiosListView.refreshList( studios );
    }
    
    function getStudiosFromLocalStorage() {
        return JSON.parse(db.getItem("studios")) || [];
    }

    function clear() {
        resetDb();
        populateStudiosList(getStudiosFromLocalStorage());
    }

    function sync() { 
        var url = "http://yoga-now-api.herokuapp.com/studios.json"
        $.getJSON(url, function(studios){       
            addStudiosToLocalStorage(studios);
            populateStudiosList(studios);
        }); 
    }

    function resetDb() {
        db.setItem("studios", JSON.stringify({ studios: [] }));
    }

    function addStudiosToLocalStorage(studios) {
    	db.setItem("studios", JSON.stringify(studios));
    };

    return {
    	initialize: initialize,
    	getStudios: getStudiosFromLocalStorage,
    	sync: sync,
    	clear: clear
    }
})();


