if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {

	var picklistItemMarkup = 
    '<li draggable="true" id="{{optionId}}" class="slds-picklist__item slds-has-icon slds-has-icon--left" aria-selected="false" tabindex="0" role="option">' +
		'<span class="slds-truncate">' +
			'<span>{{optionLabel}}</span>' +
		'</span>' +
	'</li>';

    var MultiPicklist = function(el, options) {
        this.$el = $(el);
        this.$selectedContainer = this.$el.find('[data-aljs-multi-picklist="selected"]').find('ul');
        this.$unselectedContainer = this.$el.find('[data-aljs-multi-picklist="unselected"]').find('ul');
        this.selectedItems = options.selectedItems;
        this.unselectedItems = options.unselectedItems;

        this.settings = options;

        this.init();
    };

    MultiPicklist.prototype = {
        constructor: MultiPicklist,
        init: function() {
        	this.renderPicklists();

        	this.$el.find('[data-aljs-multi-picklist="unselect"]').on('click', this, this.unselectOption);
        	this.$el.find('[data-aljs-multi-picklist="select"]').on('click', this, this.selectOption);
        	this.$el.find('[data-aljs-multi-picklist="move-up"]').on('click', this, this.moveOptionUp);
        	this.$el.find('[data-aljs-multi-picklist="move-down"]').on('click', this, this.moveOptionDown);
        },
        renderPicklists: function() {
        	var self = this;        	

        	this.unselectedItems.forEach(function(item) {
        		self.$unselectedContainer.append(self.createPicklistDomItem(item));
        	});

        	this.$unselectedContainer
	        	.on('click', 'li', function(e) {
	        		$(this).addClass('slds-is-selected')
	        			   .attr('aria-selected', 'true')
	        			   .siblings()
	        			   .removeClass('slds-is-selected')
	        			   .attr('aria-selected', 'false');
				    self.itemToSelect = $(this).data('aljs-picklist-obj');
	        	})
	        	.on('dragstart', 'li', function(e) {
	        		self.itemToSelect = $(this).data('aljs-picklist-obj');
	        	})
	        	.on('dragover', function(e) {
			        e.preventDefault();
			        e.stopPropagation();
			    })
				.on('dragenter', function(e) {
					e.preventDefault();
					e.stopPropagation();
				})
	        	.on('drop', function(e) {
	        		e.preventDefault();  
    				e.stopPropagation();
    				self.$el.find('[data-aljs-multi-picklist="unselect"]').click();
	        	});

        	this.selectedItems.forEach(function(item) {
        		self.$selectedContainer.append(self.createPicklistDomItem(item));
        	});

        	this.$selectedContainer
        		.on('click', 'li', function(e) {
	        		$(this).addClass('slds-is-selected')
	        		       .attr('aria-selected', 'true')
	        			   .siblings()
	        			   .removeClass('slds-is-selected')
	        			   .attr('aria-selected', 'false');
				    self.itemToUnselect = $(this).data('aljs-picklist-obj');
	        	})
	        	.on('dragstart', 'li', function(e) {
	        		self.itemToUnselect = $(this).data('aljs-picklist-obj');
	        	})
	        	.on('dragover', function(e) {
			        e.preventDefault();
			        e.stopPropagation();
			    })
				.on('dragenter', function(e) {
					e.preventDefault();
					e.stopPropagation();
				})
	        	.on('drop', function(e) {
	        		e.preventDefault();  
    				e.stopPropagation();
    				self.$el.find('[data-aljs-multi-picklist="select"]').click();
	        	});
        },
        selectOption: function(e) {
        	var self = e.data;

        	if (self.itemToSelect) {
	        	self.$unselectedContainer.find('#' + self.itemToSelect.id)
	        		.removeClass('slds-is-selected')
	        		.attr('aria-selected', 'false')
	        		.appendTo(self.$selectedContainer);
	        	self.unselectedItems.splice(self.unselectedItems.indexOf(self.itemToSelect), 1);
	        	self.selectedItems.push(self.itemToSelect);
	        	self.itemToSelect = null;
        	}
        },
        unselectOption: function(e) {
        	var self = e.data;

        	if (!self.itemToUnselect) { return; }

        	self.$selectedContainer.find('#' + self.itemToUnselect.id)
        		.removeClass('slds-is-selected')
        		.attr('aria-selected', 'false')
        		.appendTo(self.$unselectedContainer);
        	self.selectedItems.splice(self.selectedItems.indexOf(self.itemToUnselect), 1);
        	self.unselectedItems.push(self.itemToUnselect);
        	self.itemToUnselect = null;
        },
        moveOptionUp: function(e) {
        	var self = e.data;

        	if (!self.itemToUnselect) { return; }

        	var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

        	if (itemIndex > 0) {
        		self.selectedItems.splice(itemIndex, 1);
        		self.selectedItems.splice(itemIndex - 1, 0, self.itemToUnselect);

        		var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

        		$itemToMove.removeClass('slds-is-selected')
	        			   .attr('aria-selected', 'false')
	        			   .insertBefore($itemToMove.prev('li'));

			    self.itemToUnselect = null;
        	}
        },
        moveOptionDown: function(e) {
        	var self = e.data;

        	if (!self.itemToUnselect) { return; }

        	var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

        	if (itemIndex < self.selectedItems.length - 1) {
        		self.selectedItems.splice(itemIndex, 1);
        		self.selectedItems.splice(itemIndex + 1, 0, self.itemToUnselect);

        		var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

        		$itemToMove.removeClass('slds-is-selected')
	        			   .attr('aria-selected', 'false')
	        			   .insertAfter($itemToMove.next('li'));

			    self.itemToUnselect = null;
        	}
        },
        createPicklistDomItem: function(item) {
        	//var $picklistItem = 
        	return $(picklistItemMarkup.replace('{{optionId}}', item.id)
        							   .replace('{{optionLabel}}', item.label))
        							   .data('aljs-picklist-obj', item);
        },
        getSelectedItems: function() {
        	return this.selectedItems;
        },
        getUnselectedItems: function() {
        	return this.unselectedItems;
        }
    };

    $.fn.multiPicklist = function(options) {
        var multiPicklistArguments = arguments;
        var internalReturn;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults.
            selectedItems: [],
            unselectedItems: [],
            assetsLocation: $.aljs.assetsLocation
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-multi-picklist');

            if (!data) {
                var multiPicklistData = new MultiPicklist(this, settings);
                $this.data('aljs-multi-picklist', (data = multiPicklistData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](multiPicklistArguments[1], multiPicklistArguments[2]);
            }
        });

        if (internalReturn === undefined || internalReturn instanceof MultiPicklist) {
            return this;
        }

        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));