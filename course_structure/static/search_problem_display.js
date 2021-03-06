// Generated by CoffeeScript 1.4.0
(function() {
  var SearchProblemDisplay, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SearchProblemDisplay = (function(_super) {

    __extends(SearchProblemDisplay, _super);

    function SearchProblemDisplay(state, submission, evaluation, container, submissionField, parameters) {
      this.state = state;
      this.submission = submission;
      this.evaluation = evaluation;
      this.container = container;
      this.submissionField = submissionField;
      this.parameters = parameters != null ? parameters : {};
      SearchProblemDisplay.__super__.constructor.call(this, this.state, this.submission, this.evaluation, this.container, this.submissionField, this.parameters);
      this.problemType = this.parameters.problem_type;
      this.createSubmission();
      this.updateSubmission();
      this.showResult = this.evaluation != null;
      switch (this.problemType) {
        case 'search_tree':
          this.editable = false;
          break;
        default:
          this.editable = !this.showResult;
      }
      this.searchProblem = new SearchProblem({
        data: this.state.searchProblemData
      });
    }

    SearchProblemDisplay.prototype.render = function() {
      this.container.css('overflow', 'auto');
      this.paperContainer = $('<div>').attr('id', (new Date()).getTime());
      this.container.append(this.paperContainer);
      this.height = this.searchProblem.bounds.height;
      this.width = this.searchProblem.bounds.width;
      this.paper = new ScaleRaphael(this.paperContainer[0], this.width, this.height);
      window.paper = this.paper;
      this.createDrawers();
      this.draw();
      this.paper.scaleAll(1.5);
      return this.paperContainer.css('margin', 'auto');
    };

    SearchProblemDisplay.prototype.createSubmission = function() {
      var id, value, _ref, _results;
      this.newSubmission = {};
      if (this.submission != null) {
        _ref = this.submission;
        _results = [];
        for (id in _ref) {
          value = _ref[id];
          _results.push(this.newSubmission[id] = value);
        }
        return _results;
      }
    };

    SearchProblemDisplay.prototype.draw = function() {
      var correct, correctAnswer, drawer, edgeDrawer, node, status, _i, _len, _ref, _ref1,
        _this = this;
      _ref = this.stateDrawings;
      for (node in _ref) {
        drawer = _ref[node];
        drawer.draw();
      }
      _ref1 = this.edgeDrawings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        edgeDrawer = _ref1[_i];
        edgeDrawer.draw();
      }
      switch (this.problemType) {
        case 'search_tree':
          this.nodesInputContainer = $("<div>");
          this.nodesInput = $('<input type="text">').css('margin-top', '10px');
          this.nodesInput.val(this.newSubmission["numNodes"]);
          this.correctness = $('<p>').addClass('status');
          this.nodesInputContainer.append(this.nodesInput);
          this.nodesInputContainer.append(this.correctness);
          this.container.append(this.nodesInputContainer);
          this.correctness.css('margin-top', '20px');
          this.nodesInput.bind("change keyup keydown keypress", function(event) {
            return _this.updateValue("numNodes", parseInt(_this.nodesInput.val()));
          });
          if (this.showResult) {
            this.nodesInput.attr('disabled');
            status = this.partStatus("numNodes", parseInt(this.nodesInput.val()));
            if (status === "correct") {
              this.nodesInputContainer.addClass(status);
              this.correctness.html(status);
            } else {
              this.nodesInputContainer.addClass("incorrect");
              this.correctness.html("incorrect");
            }
            if (status !== "correct") {
              correctAnswer = this.evaluation["numNodesValue"];
              this.correctAnswerDisplay = $("<p>").html("There are " + correctAnswer + " nodes in the complete search tree.");
              return this.container.append(this.correctAnswerDisplay);
            }
          } else {
            return this.nodesInputContainer.addClass("unanswered");
          }
          break;
        default:
          if (this.showResult) {
            correct = this.evaluation['_all_'];
            if (correct) {
              status = 'correct';
            } else {
              status = 'incorrect';
            }
            this.statusContainer = $("<div>").html('States you correctly identified are marked with a solid green circle, and the states you identified incorrectly are marked with a dotted red circle.');
            this.correctness = $('<p>').addClass('status');
            this.statusContainer.append(this.correctness);
            this.container.append(this.statusContainer);
            this.statusContainer.addClass(status);
            return this.correctness.html(status);
          }
      }
    };

    SearchProblemDisplay.prototype.showAnswer = function(answer) {
      var correctAnswer, drawing, id, value, _ref, _results;
      switch (this.problemType) {
        case 'search_tree':
          correctAnswer = answer["numNodes"];
          this.correctAnswerDisplay = $("<p>").html("There are " + correctAnswer + " nodes in the complete search tree.");
          return this.container.append(this.correctAnswerDisplay);
        default:
          for (id in answer) {
            value = answer[id];
            this.evaluation = answer;
            this.submission = answer;
            this.updateValue(id, value);
          }
          _ref = this.stateDrawings;
          _results = [];
          for (id in _ref) {
            drawing = _ref[id];
            drawing.setUneditable();
            _results.push(drawing.loadValue());
          }
          return _results;
      }
    };

    SearchProblemDisplay.prototype.hideAnswer = function() {
      var drawing, id, value, _ref, _ref1, _results;
      switch (this.problemType) {
        case 'search_tree':
          if (this.correctAnswerDisplay != null) {
            return this.correctAnswerDisplay.remove();
          }
          break;
        default:
          _ref = this.newSubmission;
          for (id in _ref) {
            value = _ref[id];
            this.evaluation = null;
            this.submission = null;
            this.updateValue(id, null);
          }
          _ref1 = this.stateDrawings;
          _results = [];
          for (id in _ref1) {
            drawing = _ref1[id];
            drawing.setEditable();
            _results.push(drawing.loadValue());
          }
          return _results;
      }
    };

    SearchProblemDisplay.prototype.createDrawers = function() {
      var _ref;
      return _ref = drawSearchProblem(this.paper, this, this.searchProblem, this.height), this.stateDrawings = _ref[0], this.edgeDrawings = _ref[1], _ref;
    };

    SearchProblemDisplay.prototype.partStatus = function(id, value) {
      if (!this.liveFeedback) {
        if (!(this.submission != null) || this.submission[id] !== value || !(this.evaluation != null) || !(this.evaluation[id] != null)) {
          return "unknown";
        } else {
          if (this.evaluation[id]) {
            return "correct";
          } else {
            return "incorrect";
          }
        }
      } else {
        return console.error("Live feedback not implemented yet.");
      }
    };

    SearchProblemDisplay.prototype.getValue = function(id) {
      return this.newSubmission[id];
    };

    SearchProblemDisplay.prototype.updateValue = function(id, value) {
      this.newSubmission[id] = value;
      return this.updateSubmission();
    };

    SearchProblemDisplay.prototype.getCurrentSubmission = function() {
      return this.newSubmission;
    };

    return SearchProblemDisplay;

  })(XProblemDisplay);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.SearchProblemDisplay = SearchProblemDisplay;

}).call(this);
