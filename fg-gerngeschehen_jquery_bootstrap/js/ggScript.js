/**
 * ggScript.js - 
 * This is the main-js file for gerngeschehen.at - It should be used
 * to configure/initialize all javascript used on the page
 * @author Florian Neumann(di.neumann.florian@gmail.com)
 * */
var tooltipsEnabled = true;//Enables/disables the showing of tooltips

var iconElementType = 'i';
var iconActiveStyle = 'icon-ok';
var iconActive = '<'+iconElementType+' class="'+iconActiveStyle+'"></i>';
var iconRemoveStyle = 'icon-remove';
var iconRemove = '<'+iconElementType+' class="'+iconRemoveStyle+'"></i>';
var activeStyle = 'active';

var tags = [];
var activeFilters = [];
var activeFilterContainer;
var activeFilterContainerHeight;
var activeFilterContainerTemplate = '<div id="activeFilters"><h4>Aktive Filter:</h4></div><!--activeFilters-->'
var activeFilterContainerAnimationTime = 500; //ms

var messagebar = $('.messagebar');
var messageRemove = $('.message-remove',messagebar);
var messagePrevious = $('.message-previous',messagebar);
var messageNext = $('.message-next',messagebar);
var messageCurrentIndex = 0;
var messageCount = $('.message-count',messagebar);
var messageContent = $('.message-content',messagebar);
var messageDate = $('.message-date',messagebar);
var messageInfoContent = $('.message-info-content',messagebar);
var messageAnimationTime = 500;//ms

//Use only this methode here to initialize new js-functionallity,
//to achiev a single entry point for all scriptsl
//Called when document-loading is completed.
$(document).ready(function(){
	console.info('ggScript: init');
	//If javascript is enabled enhance the functionality of the standard html-elements (like forms,links etc.)
	enableGGJavascriptFeatures();
});

/**
 * Enable the Javascript features of gerngeschehen.at
 */
function enableGGJavascriptFeatures()
{
	console.info('ggScript: enableGGJavascriptFeatures:');
	//Enable tag-cloud
	enableTagCloud();
    //Enable form-slider for tag-cloud
    enableFormSlider();
	//Replaces std. form functionallity, with javascript-features
	enableFilterFeatures();
    //Enable bootstrap-typeahead-features on mainSearch and tagSearch
    enableBootstrapTypeahead();
    //Enable bootstrap-tooltip features on all elements with attr 'data-original-title'
    enableBootstrapTooltip();
    //Enables the main-navigation message-feature
    enableMessagebar();
    //Enables the Bootstrap-modal window features
    enableBootstrapModalFeatures();
    //Enable Ad Javascript-features
    enableAdFeatures();
    //Enable Form validation features on forms
    enableFormFeatures();
    //Enable clear searchBoxes featue
    enableClearSearchBoxesFeature()
}

/*
*Enables the clear searchbox feature, allowing
* to remove the entered search-text, also removing
* the cooresponding filter if entered search-text is
* a tag
 */
function enableClearSearchBoxesFeature()
{

    console.info('ggScript: enableClearSearchBoxesFeature');
    //Get input fields
    var inputElement = $('input:text.clearable, input:password.clearable');
    //Wrap searchElements with div with position set to relative to allow
    //absolute positioning to this element
    inputElement.wrap('<div style="position: relative; display: inline-block;"></div>');
    //Add remove icons
    inputElement.after(iconRemove);
    //Get remove icon elements and hide them
    var removeElements = inputElement.next();
    removeElements.addClass('clearIcon');
    //Check if input fields contain value, if empty hide
    inputElement.each(function(i){
          if($(this).val()=='')
          {
              $(removeElements[i]).hide();
          }
    });
    //add clear events on icons click
    removeElements.click(function(){
        var searchElement = $(this).prev();
        clearSearchInput(searchElement);
        showHideRemoveIcon(searchElement);
        searchElement.focus();
    });
    //Check on input change if to show/hide icon
    inputElement.keyup(function(){
       showHideRemoveIcon(this)
    });
    //If input-element is clicked mark text contained
    inputElement.click(function(){
       $(this).select();
    });
}

/*
 * Method for clearing input
 */
function clearSearchInput(searchElement)
{
    console.info('ggScript: clearSearchInput');
    console.log(searchElement);
    $(searchElement).val('');

}


/*
* Method showing/hiding remove-icon
*/
function showHideRemoveIcon(searchElement)
{
    console.info('ggScript: showHideRemoveIcon');
    if($(searchElement).val()==""){
        //hide icon
       $(searchElement).next().hide();
    }
    else
    {
        //show icon
        $(searchElement).next().show();
    }
}

/*
* Method enables the gerngeschehen.at form features
* like validation and keep values feature for fields
*/
function enableFormFeatures()
{
    console.info('ggScript: enableFormFeatures');
    //Enable client-side form validation
    enableFormValidationFeatures();
}


var createAccountValidator;
var loginValidator;
var facebookLoginValidator;
var forgotPasswordValidator;

/**
 * Enable javascript-features for Form validation
 * using the jQuery validation-plugin
 */
function enableFormValidationFeatures()
{
    console.info('ggScript: enableFormValidationFeatures');
    // validate signup form on keyup and submit
    createAccountValidator = $('#createAccountForm').validate({
        rules: {
            firstname: "required",
            lastname: "required",
            password: {
                required: true,
                minlength: 5
            },
            passwordConfirm: {
                required: true,
                minlength: 5,
                equalTo: "#passwordCreateAccountForm"
            },
            email: {
                required: true,
                email: true/*,
                remote: "emails.php" ToDo: Add remote-call checking if there are existing accounts with this email adresse*/
            },
            agbs: {
                required:true
            }
        },
        //instead of an error-div add data-original-title attribute used
        //as datasource for bootstrap-tooltips
        errorPlacement: function(errorLabel, element) {
            addDataForErrorTooltip(errorLabel,element);
        },
        success: function(errorLabel) {
            removeDataForErrorTooltip(errorLabel);
        }
    });

    // validate loginForm
    loginValidator = $('#loginForm').validate({
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true/*,
                 remote: "emails.php" ToDo: Add remote-call checking if there are existing accounts with this email adresse*/
            }
        },
        //instead of an error-div add data-original-title attribute used
        //as datasource for bootstrap-tooltips
        errorPlacement: function(errorLabel, element) {
            addDataForErrorTooltip(errorLabel,element);
        },
        success: function(errorLabel) {
            removeDataForErrorTooltip(errorLabel);
        }
    });

    // validate forgotPassword Form
    forgotPasswordValidator = $('#forgotPasswordForm').validate({
        rules: {
            email: {
                required: true,
                email: true/*,
                 remote: "emails.php" ToDo: Add remote-call checking if there are existing accounts with this email adresse*/
            }
        },
        //instead of an error-div add data-original-title attribute used
        //as datasource for bootstrap-tooltips
        errorPlacement: function(errorLabel, element) {
            addDataForErrorTooltip(errorLabel,element);
        },
        success: function(errorLabel) {
            removeDataForErrorTooltip(errorLabel);
        }
    });

    // validate signup form on keyup and submit
    facebookLoginValidator = $('#createAccountForm').validate({
        rules: {
            agbs: {
                required:true
            }
        },
        //instead of an error-div add data-original-title attribute used
        //as datasource for bootstrap-tooltips
        errorPlacement: function(errorLabel, element) {
            addDataForErrorTooltip(errorLabel,element);
        },
        success: function(errorLabel) {
            removeDataForErrorTooltip(errorLabel);
        }
    });
}

/*
* Methode removes the data for displaying the
* error tooltip form the input element and
* closes the tooltip
*/
function removeDataForErrorTooltip(errorLabel)
{
    console.info('ggScript: removeDataForErrorTooltip');
    //Only try to remove tooltip or clear data if data available
    if(errorLabel.attr('data-original-title')!="")
    {
        errorLabel.attr('data-original-title','');
        var elementId = errorLabel.attr('for');
        //Select element with element id and remove its tooltip
        $('#'+elementId).tooltip('hide');
    }
}

/*
* Adds the data of the jquery validation-plugin error objects
* to the data-original-title attribute of the input-element
* containing the error. This attribute is used as data-source for
* the bootstrap-tooltip used to present the error
*/
function addDataForErrorTooltip(error,element)
{
    console.info('ggScript: addDataForErrorTooltip');
    //Only refresh or try to open tooltip if new error is added or error changes
    if(element.attr('data-original-title')=="" || element.attr('data-original-title') != error.text())
    {
        element.attr('data-original-title',error.text());
        element.tooltip('show');
    }
}


/**
 * Enable javascript-features for Ads
 */
function enableAdFeatures()
{
    //TODO: Code Ad-features
    console.info('ggScript: enableAdFeatures:');

}

  /**
   *Enables the bootstrapModal features for gerngeschehen.at
  */
function enableBootstrapModalFeatures()
{
    console.info('ggScript: enableBootstrapModal:');

    var options = {
    //option         type     default           description
    'backdrop': 	/*boolean   true*/ 	true, 	//Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
    'keyboard': 	/*boolean   true*/ 	true, 	//Closes the modal when escape key is pressed
    'show': 	    /*boolean   true*/ 	false 	//Shows the modal when initialized
    };
    //Set options for login-Modal
    $('#loginModal,#facebookLoginModal,#createAccountModal,#forgotPasswordModal').modal(options);

    /* Modal events
    show 	This event fires immediately when the show instance method is called.
    shown 	This event is fired when the modal has been made visible to the user (will wait for css transitions to complete).
    hide 	This event is fired immediately when the hide instance method has been called.
    hidden 	This event is fired when the modal has finished being hidden from the user (will wait for css transitions to complete).*/

    //Add Listerner for the modal shown event
    $('#loginModal,#facebookLoginModal,#createAccountModal,#forgotPasswordModal').on('shown',modalShown);
    //Add Listerner for the modal hide event
    $('#loginModal,#facebookLoginModal,#createAccountModal,#forgotPasswordModal').on('hide',modalHide);
}

/*Performs actions needed on modal shown*/
function modalShown(){
    console.info('ggScript: modalShown:');
    selectFirstEmptyFormInputField();
    //Open error-tooltips
    $('input[data-original-title]',this).tooltip('show');
}

/*Performs actions needed on modal show*/
function modalHide(){
    console.info('ggScript: modalHide:');
    //Close error-tooltips
    $('input[data-original-title]',this).tooltip('hide');
}

/*Selects the first empty form input field of type text in the
 currently opened modal window*/
function selectFirstEmptyFormInputField()
{
    console.info('ggScript: selectFirstEmptyFormInputField:');
    $('.modal form:visible input').each(function(){
        //if input is empty set focus on it
        if($(this).val() == '' || $(this).hasClass('error'))
        {
            //Selects the content of the input-field or
            //sets focus on input-field
            $(this).select();
            return false;//Is like break; from loop
        }
    });
}

//Variable containing the users important messages shown in
//main-navigation messagebar
var messages = messagesTestData;

/**
 * Enables the messagebar-feature
 */
function enableMessagebar()
    {
   console.info('ggScript: enableMessagebar:');
   //Append messagebar-events
   appendMessagebarEvents();
   //refresh Messagebar
   refreshMessagebar();
}
/**
 * Checks the messages-array for messages
 * and animates the messagebar to needed height
 */
function refreshMessagebar()
{
   console.info('ggScript: refreshMessagebar:');
    if($(messages).size()>0)
    {
        showMessage(messageCurrentIndex);
    }
    else
    {
        closeMessagebar();
    }
}

/**
 * Closes the messagebar with an animation
 */
function closeMessagebar()
{
    animateMessagebar(0);
}

/**
 * Animate the messagebar to given height
 */
function animateMessagebar(animateToHeight)
{
   $(messagebar).animate({
           height: animateToHeight
       },
       messageAnimationTime,
       function(){/*Do nothing*/}
   );
}

/**
 * Appends the mouse-events for messagebar-elements
 */
function appendMessagebarEvents()
{
    console.info('ggScript: appendMessagebarEvents:');
    //Append click-event for message-remove
    $('.message-remove').click(removeMessage);
    //Append click-event for message-previous
    $('.message-previous').click(showPreviousMessage);
    //Append click-event for message-next
    $('.message-next').click(showNextMessage);
}

/**
 * Removes the current message from the messagebar
 */
function removeMessage()
{
    console.info('ggScript: removeMessage:');
    //Remove message from message-content container
    $(messageContent).html('');
    //Remove message from messages
    messages = $.grep(messages, function(messageJSON) {
        return messageJSON != messages[messageCurrentIndex];
    });

    //If any, show next message
    if($(messages).size()>0)
    {
        //Show next message
        showNextMessage();
    }
    else//otherwise close messagebar
    {
        closeMessagebar();
    }


}

/**
 * Remove old message and show new Message
 */
function showMessage(messageIndex)
{
    console.info('ggScript: showMessage:');
    //Set the message-count
    $(messageCount).html($(messages).size());
    //Set message-date
    $(messageDate).html(messages[messageCurrentIndex].dateTime);

    //Add new message
    $(messageContent).html(messages[messageCurrentIndex].content);
    //Get new height
    var neededHeight = $(messageContent).height()+ 10;
    //Animate the messagebar to needed Height
    animateMessagebar(neededHeight);
}

/**
 * Shows previous message in the messagebar
 */
function showPreviousMessage()
{
    console.info('ggScript: showPreviousMessage:');
    messageCurrentIndex--;
    if(messageCurrentIndex<0)
    {
      messageCurrentIndex = $(messages).size()-1;
    }
    showMessage(messageCurrentIndex)
}

/**
 * Shows previous message in the messagebar
 */
function showNextMessage()
{
    console.info('ggScript: showNextMessage:');
    messageCurrentIndex++;
    if(messageCurrentIndex>$(messages).size()-1)
    {
        messageCurrentIndex = 0;
    }
    showMessage(messageCurrentIndex);
}

/**
 * Enable twitter-bootstrap tooltip-features
 */
function enableBootstrapTooltip()
{
    console.info('ggScript: enableBootstrapTooltip:');
    var options1 = {
    /*name          value        type                default     description */
    animation:    true,         //boolean 	         true 	    apply a css fade transition to the tooltip
    placement:    'bottom',     //string|function 	'top' 	    how to position the tooltip - top | bottom | left | right
    //style:        'error',    //string            ''          allows adding of a style class to the tooltip
    //selector: 	'false',    //string 	         false 	    If a selector is provided, tooltip objects will be delegated to the specified targets.
    //title: 	    '',         //string | function ''      	default title value if `title` tag isn't present
    //trigger: 	    'hover',     //string 	        'hover' 	how tooltip is triggered - hover | focus | manual
    delay: 	    { show: 1500, hide: 500 } /*number | object 	0           delay showing and hiding the tooltip (ms)
                                                                If a number is supplied, delay is applied to both hide/show
                                                                Object structure is: delay: { show: 500, hide: 100 } */
    };
    var options2 = {
        placement:    'right',
        delay: 	    { show: 1500, hide: 500 },
        animation: true
    };

    //Add Tooltips to elements in the main-navigation
    $('#mainNavigation [data-original-title]').tooltip(options1);
    //Add Tooltips to elements in header
    $('#headContent [data-original-title]').tooltip(options1);
    //Add Tooltips to elements in sidebar
    $('[data-original-title]',sidebarLeft).tooltip(options2);
    //Add Tooltips used for error-handling on modal input form-elements
    var inputs = $('.modal input');
    var options3 =
    {
        placement: 'sibling right',
        style:  'error',
        trigger: 'manual',
        animation: true,
        template: '<div class="tooltip error"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'

    };
    inputs.each(function(){
        $(this).tooltip(options3);
    });

}

function enableFormSlider()
{
   // form_widget_amount_slider('slider_target',$('input.tagSearchMinCount',sidebarLeft),200,0,360,"setColorByHSB()");
}

/**
 * Enable twitter-bootstrap typeahead-features
 */
function enableBootstrapTypeahead()
{
    console.info('ggScript: enableBootstrapTypeahead:');
    var options={source:tags,items:6,property: "tag", onselect: function(obj) {
        var filterObject = createFilterObject(obj);
        addActiveFilter(filterObject);
        addActiveFilterToView(filterObject);
    }//,matcher:function(){}, sorter:function(){}, highlighter:function(){}
    };
    var options2={source:tags,items:6,property: "tag"};
    //Select and enable mainSearch-Input
    $('input#mainSearchText').typeahead(options);
    //Select and enable tagSearch-Input
    $('input#tagSearchText').typeahead(options2);
}

/**
 * Enables the tag-cloud feature of the sidebar
 */
function enableTagCloud()
{
	console.info('ggScript: enableTagCloud:');
	var tagCloudContainer = $("#tagCloud");
	//Save container-content and overwrite it
		var tagCloudFormContent = $(tagCloudContainer).html();
		tags = getTagsFromInputElements(tagCloudFormContent);
		$(tagCloudContainer).tagCloud(tags);

}
/**
 * Parses given html into filter-objects used for the filter-features of the sidebar
 * @param htmlToParse The html-fragment containing the tags to parse into filter-objects
 */
function getTagsFromInputElements(htmlToParse)
{
	console.info('ggScript: getTagsFromInputElements');
	//Get all input elements of type checkbox
	var inputElements = $('input:checkbox',htmlToParse);
	//Iterate inputElements check for needed attributes, create tag-json-elements
	//and feed them to tag array
	$(inputElements).each(function(){
		if($(this).attr('id') && $(this).attr('count'))
		{
			tags.push(createFilterObject(this));
		}
		else
		{
			console.error('ggScript: getTagsFromInputElements: Needed attribute missing on input:checkbox')
		}
	});

	return tags;
}

//Contains jquery-object containing the html-code of sidebar
var sidebarLeft = $('div#mainContent div#sidebarLeft');

/**
 * Enables the filter-features of the sidebar
 */
function enableFilterFeatures(){
    console.info('ggScript: enableFormAjaxFeatures');
    var formButtonSubmit = [];
    //Add remove-events to all filter-view-elements
    $(document).on("mousedown", 'div#mainContent div#sidebarLeft div#activeFilters a.', this, removeActiveFilterViewElementOnClose);
    $(document).on("mousedown", 'div#tagCloud a.tagcloudlink', this, addActiveFilterFromTagCloud);
    //Add mouseover-effects to all sidebarLi
    var sidbarLi = $('ul.filters li',sidebarLeft);
    var activeSelector = iconElementType+'.'+iconActiveStyle;
    var removeSelector = iconElementType+'.'+iconRemoveStyle;
    //Hide all unneeded form-checkboxes
    $('ul.filters input:checkbox',sidebarLeft).each(function(){
            //Write there tag-attributes on li-element to allow creation of
            //filter-object from li
            var parentLi = $(this).parents('li');
            parentLi.attr('id',$(this).attr('id'));
            parentLi.attr('name',$(this).attr('name'));
            parentLi.attr('value',$(this).attr('value'));
            //Hide checkbox
            $(this).hide();

    });
    //Controls behaviour on mouseenter on sidbar-list-element
    $(sidbarLi).mouseenter(function(event){
        event.preventDefault();
        var targetElement  = $('label',this);
        if(//if no over-icon exists in targetElement, add icon-ok
            $(removeSelector,targetElement).size()==0 &&
                $(activeSelector,targetElement).size()==0
            ){
            $(targetElement).append(iconActive);
        }
    });
    //Controls behaviour on mouseleave on sidbar-list-element
    $(sidbarLi).mouseleave(function(event){
        event.preventDefault();
        var targetElement  = $('label',this);
        if(//if overElement has activeStyle make sure icon-ok exists
            $(this).hasClass(activeStyle)
            ){
            if(//if icon-active exists switch it to icon-remove
                $(removeSelector,targetElement).size()>0
                ){
                var iconElement = $(removeSelector,targetElement)
                $(iconElement,targetElement).removeClass(iconRemoveStyle);
                $(iconElement,targetElement).addClass(iconActiveStyle);
            }else if(//if icon-active doesn't exist, add it
                $(activeSelector,targetElement).size()==0
                )
            {
                $(targetElement).append(iconActive);
            }
        }else{//remove over-icon
            $(iconElementType+'.'+iconActiveStyle,targetElement).remove();
            $(iconElementType+'.'+iconRemoveStyle,targetElement).remove();
        }
    });
    //Controls behaviour on mousedown on sidbar-list-element
    $(sidbarLi).mousedown(function(event){
        event.preventDefault();
        var iconElement;
        var targetElement  = $('label',this);
        if(//if icon-active exists switch it with icon-remove
            $(activeSelector,targetElement).size()>0 &&
                $(this).hasClass(activeStyle)
            ){
            iconElement = $(activeSelector,targetElement);
            $(iconElement).removeClass(iconActiveStyle);
            iconElement.addClass(iconRemoveStyle);
        }else if(//if icon-remove exists switch it with icon-active
            $(removeSelector,targetElement).size()>0 &&
                !$(this).hasClass(activeStyle)
            ){
            iconElement = $(removeSelector,targetElement)
            $(iconElement).removeClass(iconRemoveStyle);
            iconElement.addClass(iconActiveStyle);
        }
        toogleActiveStyle(this);
    });
}

/**
 * Toggles the active-style on the passed overElement
 * @param overElement the element listening to the mouseover-event
 */
function toogleActiveStyle(overElement)
{
	console.info('ggScript: toogleActiveStyle');
	if(//if activeStyle exists on overElement, remove it
		$(overElement).hasClass(activeStyle)
	){
		$(overElement).removeClass(activeStyle);
        removeActiveFilter(createFilterObject(overElement));
        removeActiveFilterFromView(createFilterObject(overElement));
	}else{//otherwise add activeStyle
		$(overElement).addClass(activeStyle);
        addActiveFilter(createFilterObject(overElement));
        addActiveFilterToView(createFilterObject(overElement));
	}
}

/**
 * Adds a filter to activeFilters-array
 * @param filterObject json-object containing filter-properties (tag,count,value,name,id)
 */
function addActiveFilter(filterObject){
    console.info('ggScript: addActiveFilter:');
	var isAlreadyActiveFilter = false;
	$(activeFilters).each(function(){
		if(filterObject.id == this.id)
		{
			isAlreadyActiveFilter = true;
			return false;  //Is like a 'break;' from the loop
		}
	});
	if(!isAlreadyActiveFilter)
	{
		activeFilters.push(filterObject);
	}
}

/**
 * Removes a filter from activeFilters-array
 * @param filterObject json-object containing filter-properties (tag,count,value,name,id)
 */
function removeActiveFilter(filterObject){
    console.info('ggScript: filterObject:');
	var updatedFilterArray = [];
	//Remove active Filter from array
	$(activeFilters).each(function(){
		if(this.value != filterObject.value)
		{
			updatedFilterArray.push(this);
		}
	});
	activeFilters = updatedFilterArray;
}

function updateActiveFilterViewContainer()
{
    console.info('ggScript: updateActiveFilterViewContainer:');
    var activeFilterContainer;
    //Check if activeFilter-container needs to be created
    if($(activeFilters).size()!=0 && $('div#activeFilters',sidebarLeft).size()==0)
    {
        //Add Container
        $('form#filters',sidebarLeft).before(activeFilterContainerTemplate) ;
        activeFilterContainer = $('div#activeFilters',sidebarLeft);
        //Save needed height and set height to null
        $(activeFilterContainer).height(0);
    }
    else
    {
       //Get reference to activeFiltersContainer
        activeFilterContainer = $('div#activeFilters',sidebarLeft);
    }
    //Check if all contained activeFilterView-Elements are visible.
    //If not animate to needed height
    var lastActiveFilterViewElement = $('div#activeFilters a:last',sidebarLeft);

    if(lastActiveFilterViewElement.offset() && lastActiveFilterViewElement)
    {
        var lastActiveFilterViewElementOffsetTop =  lastActiveFilterViewElement.offset().top;
        var activeFilterContainerOffsetTop =  activeFilterContainer.offset().top;

        var activeFilterContainerYMaxPosition = activeFilterContainerOffsetTop + $(activeFilterContainer).height();
        var activeFilterViewElementYMaxPosition = lastActiveFilterViewElementOffsetTop + $(lastActiveFilterViewElement).height();
        //Size activeFilterContainer up to needed size
        if(activeFilterViewElementYMaxPosition > activeFilterContainerYMaxPosition)
        {
            $(activeFilterContainer).animate({
                    height: $(activeFilterContainer).height() + (activeFilterViewElementYMaxPosition-activeFilterContainerYMaxPosition) +2
                },
                activeFilterContainerAnimationTime,
                function(){/*Do nothing*/}
            );
        }
        //Shrink activeFilterContainer to needed size
        else if(activeFilterViewElementYMaxPosition < activeFilterContainerYMaxPosition && activeFilterContainerYMaxPosition - activeFilterViewElementYMaxPosition >= lastActiveFilterViewElement.height())
        {
            $(activeFilterContainer).animate({
                    height: $(activeFilterContainer).height() - lastActiveFilterViewElement.height() - 2
                },
                activeFilterContainerAnimationTime,
                function(){/*Do nothing*/}
            );
        }
    }

    //Close active filter container with animation
    if($(activeFilters).size() == 0)
    {
        //if not animate container to height 0
        //Animate to needed height
        $(activeFilterContainer).animate({
                height: 0
            },
            activeFilterContainerAnimationTime,
            function(){$(this).remove()}
        );
    }

    return activeFilterContainer;
}

/**
 * Adds activeFilterContainer and controls its size. Adds a filter-view-element to
 * activeFilterContainer
 * @param filterObject json-object containing filter-properties (tag,count,value,name,id)
 */
function addActiveFilterToView(filterObject)
{
    console.info('ggScript: addActiveFilterToView:');
    //Makes sure activeFiltersContainer exists
    var activeFilterContainer = updateActiveFilterViewContainer();
    var foundFilterObject = false;
    $('a',activeFilterContainer).each(function(){
       if(filterObject.id == createFilterObject(this).id)
       {
           foundFilterObject = true;
           return false;//Is like breake from loop
       }
    });
    if(!foundFilterObject)
    {
        //Append filter to activeFiltersContainer
        var activeFilterViewElement = createActiveFilterViewElement(filterObject);
        activeFilterContainer.append(activeFilterViewElement);
        //Check if activeFilterContainer needs height-update
        updateActiveFilterViewContainer();
    }
}

/**
 * Creates/Adds an activeFilter-object, from tagCloud-Link
 */
function addActiveFilterFromTagCloud(){
    console.info('ggScript: addActiveFilterFromTagCloud');
    var filterObject = createFilterObject(this);
    //Add filterObject to activeFilter-array
    addActiveFilter(filterObject);
    //Add activeFilter-viewElement
    addActiveFilterToView(filterObject);
}

/**
 * Removes filter-view-element from activeFilters-container when sidebarLi is
 * used to remove the filter
 * @param filterObject json-object containing filter-properties (tag,count,value,name,id)
 */
function removeActiveFilterFromView(filterObject)
{
	//Find filter-element and remove it
    var currentFilterElement;
    $('div#activeFilters a',sidebarLeft).each(function(){
        currentFilterElement = createFilterObject(this);
        if(createFilterObject(this).id == filterObject.id)
        {
            $(this).parent('div:first').remove();
            return false;//is like a break from loop
        }
    });
    //Remove filterObject from activeFilters-array
    removeActiveFilter(filterObject);
    //Check if activeFiltersViewContainer needs update
    updateActiveFilterViewContainer();
}

/**
 * Removes the activeFilter-view-element from screen when using the a.close on activeFilterViewElement
 * Also removes the activeIcon and the activeStyle from sidebarLi, if deleted element matches the properties
 * of one the sidebarLis
 */
function removeActiveFilterViewElementOnClose()
{
    console.info('ggScript: removeActiveFilterViewElementOnClose:');
    //Removes filter-view-element
    $(this).parent().remove();
    //Remove filter from activeFilters-array
    var filterObject = createFilterObject(this);
    removeActiveFilter(filterObject);
    //Remove filter element from view
    removeActiveFilterFromView(filterObject);
    //Check if activeFilterContainer needs to be removed/updated
    updateActiveFilterViewContainer();
    var sideBarLi;
    //Toogle active-style on sidebarLeftLi-items
    $('li', sidebarLeft).each(function(){
         if(createFilterObject(this).id == filterObject.id)
         {
            sideBarLi = this;
             return false;//is like break from loop
         }
    });
    //Remove activeIcon
    $(iconElementType+'.'+iconActiveStyle,sideBarLi).remove();
    //Remove activeState
    $(sideBarLi).removeClass(activeStyle);
}

/**
 * Creates and returns a filter-object containing the properties (tag,count,value,name,id) form a
 * given html-elment
 * @param filterDataElement html-element containing filter-attributes (tag,count,value,name,id)
 */
function createFilterObject(filterDataElement)
{
    console.info('ggScript: createFilterObject:');
    var name = $(filterDataElement).attr('name');
    var id = $(filterDataElement).attr('id');
    var count = $(filterDataElement).attr('count');
    var value =  $(filterDataElement).attr('name');

	return {"tag":name,
        "id":id,
        "value":value,
        "name":name,
        "count":count};
}

/**
 * Creates a filter-view-element
 * @param filterObject json-object containing filter-properties (tag,count,value,name,id)
 */
function createActiveFilterViewElement(filterObject){
    console.info('ggScript: createActiveFilterViewElement:');
    var additionalClass;
    switch(filterObject.id)
    {
        case "offer":
        additionalClass = filterObject.id;
        break;
        case "search":
            additionalClass = filterObject.id;
            break;
        case "tip":
            additionalClass = filterObject.id;
            break;
        default:
            additionalClass = '';
            break;
    }
    return '<div id="'+filterObject.id+'" class="label '+additionalClass+'">'+filterObject.name+'<a id="'+filterObject.id+'" count="'+filterObject.count+'" value="'+filterObject.value+'" name="'+filterObject.name+'" class="close">&times;</a></div>'
}
	

