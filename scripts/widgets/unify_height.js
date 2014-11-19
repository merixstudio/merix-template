define('widgets/unify_height', '', function() {
    
    function unifyHeight(elements, perRow) {
        var maxHeight = [];
        var elements = document.querySelectorAll(elements);
        
        Array.prototype.forEach.call(elements, function(el, index){        
            var boxHeight = elements[index].offsetHeight;
            var row = Math.floor(index / perRow);
            maxHeight[row] = Math.max(maxHeight[row] || 0, boxHeight);
        });

        Array.prototype.forEach.call(elements, function(el, index){    
            var row = Math.floor(index / perRow);
            elements[index].style.height = maxHeight[row] + 'px';
        });
        
    };
    
    return unifyHeight;
});