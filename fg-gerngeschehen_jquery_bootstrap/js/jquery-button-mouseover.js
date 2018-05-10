/**
 * jquery-button-mouseover -
 * 
 * @author Florian Neumann (di.neumann.florian@gmail.com)
 */
(function( $ ) {
jQuery.fn.selectableIconButton = function() 
{
	this.mouseEnter

};
})( jQuery );

/**
 * This method handles the adding, removal and switching
 * @param overElement the element listening to the mouseover-event
 * @param targetElement the element to contain the over-icon
 */
function toogleIcons(overElement,targetElement)
{
	if(//if no over-icon exists in targetElement, add icon-ok 
		$(iconActive,targetElement).size()==0 &&
		$('i.icon-remove',targetElement).size()==0
	){
		$(targetElement).children('label').append(iconActive);
	}else if(//if icon-ok exists switch it with icon-remove
		$(targetElement)
	){}
}

//Find (and save reference) all relevant form objects and apply there new functionallity
			//First hide unneed form elements
				$('ul.filters input:checkbox',sidebarLeft).each(function(){
						formInput.push(this);
						$(this).hide();
				});
				//Unbind all events from li
				$(sidbarLi).unbind();
				//Add mouseOver-Effect/Icon to li label
				$(sidbarLi).mouseenter(function(event){
					console.log('enter')
					if(!$(this).hasClass(activeStyle))
					{
						if($('i.icon-ok',this).size()==0 && $('i.icon-remove',this).size()==0)
						{
							$(this).children('label').append(iconActive);
						}
					}
					else
					{
						$('i.icon-ok',this).remove();
						if($('i.icon-ok',this).size()==0 && $('i.icon-remove',this).size()==0)
						{
							$(this).children('label').append(iconInactivate);
						}
					}
					
				});
				$(sidbarLi).mousedown(function(event){
					console.log('down');
					if(!$(this).hasClass(activeStyle))
					{	
									
					}
					else
					{
																
					}
				});
				$(sidbarLi).mouseup(function(event){
					console.log('up');
					if($(this).hasClass(activeStyle))
					{	
						
					}
					else
					{
						
					}
					
				});
				$(sidbarLi).click(function(event){
					console.log('click');
					var filterValue = $('input:checkbox',this).attr('value');
					if($(this).hasClass(activeStyle))
					{	
						var filterName = $('label',this).text();
						$(this).addClass(activeStyle);
						addActiveFilter(createFilterObject(filterValue,filterName))
					}
					else
					{
						$(this).removeClass(activeStyle);
						removeActiveFilter(filterValue);
					}
					
				});
				/*//Remove mouseOver-Effect/Icon to li label
				$(sidbarLi).mouseleave(function(event){
					console.log('leave')
					if($(this).hasClass(activeStyle))
					{
						$('i.icon-remove',this).remove();
						if($('i.icon-ok',this).size()==0 && $('i.icon-remove',this).size()==0)
						{
							
						}
					}
					else
					{
					}
				}*/
