(function (global, docRef) {
  'use strict';

  var listParentNode = null,
    draggableNodes = [],
    dragging = null,
    setParentListDataAttribute = true;

  init();
  ///////////////

  /**
   * Init drag drop script.
   */
  function init() {
    addDraggableEventHandlers();
  }

  /**
   * Add dragstart event and draggable attribute to all draggable elements.
   */
  function addDraggableEventHandlers() {
    listParentNode = getListParentNode();
    updateNodeReferenceData();
    if (draggableNodes.length > 0) {
      draggableNodes.forEach(function (element) {
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragenter', handleDragEnter);
        element.addEventListener('dragleave', handleDragLeave);
        element.addEventListener('drop', handleDrop);
      });
    }
  }

  /////////////////////
  // EVENT HANDLERS
  /////////////////////
  /**
   * Drag start event handler.
   *
   * @param {DragEvent} event DragStart type
   */
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerText);
    event.dataTransfer.dropEffect = 'copy';
    dragging = event.target;
  }

  /**
   * Drag over event handler.
   *
   * @param {DragEvent} event DragOver type.
   */
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  /**
   * Drag enter event handler.
   *
   * @param {DragEvent} event DragEnter type.
   */
  function handleDragEnter(event) {
    event.preventDefault();

    if (dragging) {
      var targetNode = closestNodeBySelector(event.target, '.drag-drop-list-item');
      addCssSelectorToElement(targetNode, 'hovered');
    }
  }

  /**
   * Drag leave event handler.
   *
   * @param {DragEvent} event DragLeave type.
   */
  function handleDragLeave(event) {
    event.preventDefault();
    removeCssSelectorFromElement(this, 'hovered');
  }

  /**
   * Drop event handler.
   *
   * @param {DragEvent} event Drop type.
   */
  function handleDrop(event) {
    event.preventDefault();
    updateNodeReferenceData();

    if (dragging) {
      // Make sure we are getting the closest node that is also
      // A draggable list item and not the parent by mistake.
      var dropNode = closestNodeBySelector(event.target, '.drag-drop-list-item');
      var dragIndex = draggableNodes.indexOf(dragging);
      var dropIndex = draggableNodes.indexOf(dropNode);

      if (dragIndex < dropIndex) {
        listParentNode.insertBefore(dragging, dropNode.nextSibling);
      } else {
        listParentNode.insertBefore(dragging, dropNode);
      }
    }

    removeCssSelectorFromElement(event.target, 'hovered');
    updateNodeReferenceData();
  }


  /////////////////////
  // UTILITIES
  /////////////////////
  /**
   * Utility that updates the draggable node list.
   */
  function updateNodeReferenceData() {
    draggableNodes = getDraggableNodes();
    if (setParentListDataAttribute) {
      listParentNode.setAttribute('data-list-data', getDraggableNodeListData(draggableNodes));
    }
  }

  /**
   * Utility that adds a css selector to an element if the selector doesn't already exist.
   *
   * @param {HTMLElement} element Target element.
   * @param {string} cssSelector CSS Selector to add.
   */
  function addCssSelectorToElement(element, cssSelector) {
    try {
      if (element && element.className && element.className.indexOf(cssSelector) === -1) {
        element.className += ' ' + cssSelector;
      }
    } catch (exception) {
      // Silent fail
    }
  }

  /**
   * Utility that removes a css selector from an element if it exists.
   *
   * @param {HTMLElement} element Target element.
   * @param {string} cssSelector CSS Selector to remove.
   */
  function removeCssSelectorFromElement(element, cssSelector) {
    try {
      if (element && element.className.indexOf(cssSelector) > -1) {
        element.className = element.className.split(' ').filter(function (classpart) {
          return classpart !== cssSelector;
        }).join(' ').trim();
      }
    } catch (exception) {
      // Silent fail
    }
  }

  /**
   * Utility that grabs the parent list element.
   *
   * @returns {HTMLElement} Parent list element
   */
  function getListParentNode() {
    try {
      return Array.from(docRef.getElementsByClassName('drag-drop-list'))[0] || null;
    } catch (exception) {
      // Silent fail
    }
  }

  /**
   * Returns the closest node the the referenced that has the referenced selector.
   *
   * @param {HTMLElement} node Reference node.
   * @param {string} selector Element selector reference.
   * @returns {HTMLElement | null} Returns element if a match is found or null.
   */
  function closestNodeBySelector(node, selector) {
    try {
      return node.closest(selector);
    } catch (exception) {
      // Silent fail
      return null;
    }
  }

  /**
   * Utility for providing an array of the current list data.
   *
   * @param {Array<HTMLElement>} draggableNodes List of draggable elements.
   * @returns {Array<string>} Current list data.
   */
  function getDraggableNodeListData(draggableNodes) {
    try {
      if (draggableNodes) {
        return draggableNodes.map(function (node) {
          return node.innerText ? node.innerText : null;
        });
      }
    } catch (exception) {
      // Silent fail
      return [];
    }
  }

  /**
   * Find all draggable elements on the dom
   * @returns {Array<HTMLElement>} Returns an array of draggable dom elements.
   */
  function getDraggableNodes() {
    try {
      return Array.from(docRef.getElementsByClassName('drag-drop-list-item')) || [];
    } catch (exception) {
      // Silent fail
      return [];
    }
  }

})(window, document);
