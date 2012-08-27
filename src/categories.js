$require("/lib/tau.ui.ctrl.js");
$class('hotnews.Categories').extend(tau.ui.SceneController).define({
  Categories: function () {
    this.setTitle('Hot News');
  },

  init: function () {

  },

  loadScene: function () {
    this.table = new tau.ui.Table({});
    this.table.onEvent(tau.ui.Table.EVENT_MODEL_LOAD, this.loadModel, this);
    this.table.onEvent(tau.ui.Table.EVENT_CELL_LOAD, this.loadCell, this);
    this.getScene().add(this.table);
    this.table.loadModel(true);
  },

  loadModel: function () {
    // TODO get categories from server
    this.categories = [{
      id: 'web',
      label: 'Web'
    }, {
      id: 'java',
      label: 'Java'
    }, {
      id: 'eclipse',
      label: 'Eclipse'
    }];
    this.table.addNumOfCells(this.categories.length);
  },

  loadCell: function (e, payload) {
    var index = payload.index;
    var cell = new tau.ui.TableCell({
      title: this.categories[index].label,
    });
    this.table.add(cell);
  },

});