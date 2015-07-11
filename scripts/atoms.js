var Atoms = (function () {

  var World = function () {
    var canvas = document.getElementById('world');

    if(!canvas.getContext) {
      throw new Error('Unable to find canvas context');
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.painter = canvas;
    this.atoms = [];

    this.populate();
  };

  World.prototype.populate = function () {
    var nbAtomsToGenerate = Math.max(128, Math.random() * 128);

    for (var i = 0; i < nbAtomsToGenerate; i++)  {
      this.atoms.push(new Atom(this.painter));
    }
  };

  World.prototype.run = function () {
    var that = this;

    setInterval(function () {
        that.tick();
    }, 24);
  };

  World.prototype.tick = function () {
    var i = this.atoms.length;

    this.clear();

    while (i--) {
      this.atoms[i].update();
      this.atoms[i].render();
    }

    this.update();
  };

  World.prototype.clear = function () {
    var ctx = this.painter.getContext('2d');

    ctx.clearRect(0, 0, this.painter.width, this.painter.height);
  };

  World.prototype.update = function () {
    var that = this;
    var i = that.atoms.length;

    while (i--) {
      that.atoms[i].siblings(that.atoms.filter(function (curr) {
        return curr !== that;
      }));
    }
  };

  var Atom = function (painter) {
    this.painter = painter;
    this.x = Math.round(Math.random() * painter.width);
    this.y = Math.round(Math.random() * painter.height);
    this.vx = -1 + Math.random() * 2;
    this.vy = -1 + Math.random() * 2;
    this.size = Math.max(5, Math.random() * 10);
    this.color = '#2C3E50';
  };

  Atom.prototype.render = function () {
    var ctx = this.painter.getContext('2d');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  Atom.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.x += this.painter.width;
    }
    else if (this.x > this.painter.width) {
      this.x -= this.painter.width;
    }

    if (this.y < 0) {
      this.y += this.painter.height;
    }
    else if (this.y > this.painter.height) {
      this.y -= this.painter.height;
    }
  };

  Atom.prototype.siblings = function (elements) {
    var siblings = [];
    var i = elements.length;

    while (i--) {
      if ((elements[i].x >= this.x - 50 && elements[i].x <= this.x + 50) && (elements[i].y >= this.y - 50 && elements[i].y <= this.y + 50)) {
        this.addConnection(elements[i]);
      }
    }
  };

  Atom.prototype.addConnection = function (sibling) {
    var ctx = this.painter.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(sibling.x, sibling.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  };

  var game = new World();
  game.run();
})();
