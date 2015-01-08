var BunnyMark;
(function (BunnyMark) {
    var Rectangle = (function () {
        function Rectangle(x, y, w, h) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof w === "undefined") { w = 0; }
            if (typeof h === "undefined") { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        return Rectangle;
    })();
    BunnyMark.Rectangle = Rectangle;
})(BunnyMark || (BunnyMark = {}));
var BunnyMark;
(function (BunnyMark) {
    var Timer = (function () {
        function Timer() {
            this._start = new Date().valueOf();
        }
        Timer.prototype.getTimer = function () {
            return Date.now() - this._start;
        };
        return Timer;
    })();
    BunnyMark.Timer = Timer;
})(BunnyMark || (BunnyMark = {}));
var BunnyMark;
(function (BunnyMark) {
    var ImageLoader = (function () {
        function ImageLoader() {
            this._queue = [];
            this._successCount = 0;
            this._errorCount = 0;
            this._cache = {};
            if (ImageLoader._instance)
                throw new Error("singleton error");
        }
        ImageLoader.getInstance = function () {
            if (!ImageLoader._instance)
                ImageLoader._instance = new ImageLoader();
            return ImageLoader._instance;
        };

        ImageLoader.prototype.add = function (path) {
            this._queue.push(path);
        };

        ImageLoader.prototype.downloadAll = function (p_callback) {
            var _this = this;
            if (this._queue.length <= 0)
                return p_callback();

            for (var i = 0; i < this._queue.length; i++) {
                var img = new Image();

                img.onload = function (e) {
                    _this._successCount++;
                    if (_this.isDone())
                        p_callback();
                };
                img.onerror = function (e) {
                    _this._errorCount++;
                    if (_this.isDone())
                        p_callback();
                };
                img.src = this._queue[i];
                this._cache[this._queue[i]] = img;
            }
        };

        ImageLoader.prototype.isDone = function () {
            return this._queue.length == (this._successCount + this._errorCount);
        };

        ImageLoader.prototype.get = function (path) {
            return this._cache[path];
        };
        return ImageLoader;
    })();
    BunnyMark.ImageLoader = ImageLoader;
})(BunnyMark || (BunnyMark = {}));
var GPUSprite;
(function (_GPUSprite) {
    var GPUSprite = (function () {
        function GPUSprite() {
            this._parent = null;
            this._spriteId = 0;
            this._childId = 0;

            this._scaleX = 1.0;
            this._scaleY = 1.0;
            this._rotation = 0;
            this._alpha = 1.0;
            this._visible = true;
        }
        Object.defineProperty(GPUSprite.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (isVisible) {
                this._visible = isVisible;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (a) {
                this._alpha = a;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "position", {
            get: function () {
                return this._pos;
            },
            set: function (pt) {
                this._pos = pt;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (val) {
                this._scaleX = val;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (val) {
                this._scaleY = val;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (val) {
                this._rotation = val;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSprite.prototype, "rect", {
            get: function () {
                return this._parent._spriteSheet.getRect(this._spriteId);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GPUSprite.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GPUSprite.prototype, "spriteId", {
            get: function () {
                return this._spriteId;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GPUSprite.prototype, "childId", {
            get: function () {
                return this._childId;
            },
            enumerable: true,
            configurable: true
        });
        return GPUSprite;
    })();
    _GPUSprite.GPUSprite = GPUSprite;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var GPUSpriteRenderLayer = (function () {
        function GPUSpriteRenderLayer(context3D, spriteSheet) {
            this._context3D = context3D;
            this._spriteSheet = spriteSheet;

            this._vertexData = [];
            this._indexData = [];
            this._uvData = [];

            this._children = [];
            this._updateVBOs = true;

            this.setupShaders();
            this.updateTexture();
        }
        Object.defineProperty(GPUSpriteRenderLayer.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (parentStage) {
                this._parent = parentStage;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSpriteRenderLayer.prototype, "numChildren", {
            get: function () {
                return this._children.length;
            },
            enumerable: true,
            configurable: true
        });

        GPUSpriteRenderLayer.prototype.createChild = function (spriteId) {
            var sprite = new GPUSprite.GPUSprite();
            this.addChild(sprite, spriteId);
            return sprite;
        };

        GPUSpriteRenderLayer.prototype.addChild = function (sprite, spriteId) {
            sprite._parent = this;
            sprite._spriteId = spriteId;

            sprite._childId = this._children.length;
            this._children.push(sprite);

            var childVertexFirstIndex = (sprite._childId * 12) / 3;
            this._vertexData.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
            this._indexData.push(childVertexFirstIndex, childVertexFirstIndex + 1, childVertexFirstIndex + 2, childVertexFirstIndex, childVertexFirstIndex + 2, childVertexFirstIndex + 3);

            var childUVCoords = this._spriteSheet.getUVCoords(spriteId);
            this._uvData.push(childUVCoords[0], childUVCoords[1], childUVCoords[2], childUVCoords[3], childUVCoords[4], childUVCoords[5], childUVCoords[6], childUVCoords[7]);

            this._updateVBOs = true;
        };

        GPUSpriteRenderLayer.prototype.removeChild = function (child) {
            var childId = child._childId;
            if ((child._parent == this) && childId < this._children.length) {
                child._parent = null;
                this._children.splice(childId, 1);

                var idx;
                for (idx = childId; idx < this._children.length; idx++) {
                    this._children[idx]._childId = idx;
                }

                var vertexIdx = childId * 12;
                var indexIdx = childId * 6;
                this._vertexData.splice(vertexIdx, 12);
                this._indexData.splice(indexIdx, 6);
                this._uvData.splice(vertexIdx, 8);

                this._updateVBOs = true;
            }
        };

        GPUSpriteRenderLayer.prototype.draw = function () {
            var nChildren = this._children.length;
            if (nChildren == 0)
                return;

            for (var i = 0; i < nChildren; i++) {
                this.updateChildVertexData(this._children[i]);
            }

            this._context3D.setProgram(this._shaderProgram);
            this._context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this._context3D.setProgramConstantsFromMatrix("vc0", this._parent.modelViewMatrix, true);
            this._context3D.setTextureAt("fs0", this._spriteSheet._texture);

            if (this._updateVBOs) {
                this._vertexBuffer = this._context3D.createVertexBuffer(this._vertexData.length / 3, 3);
                this._indexBuffer = this._context3D.createIndexBuffer(this._indexData.length);
                this._uvBuffer = this._context3D.createVertexBuffer(this._uvData.length / 2, 2);
                this._indexBuffer.uploadFromVector(this._indexData, 0, this._indexData.length);
                this._uvBuffer.uploadFromVector(this._uvData, 0, this._uvData.length / 2);
                this._updateVBOs = false;
            }

            this._vertexBuffer.uploadFromVector(this._vertexData, 0, this._vertexData.length / 3);
            this._context3D.setVertexBufferAt("va0", this._vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
            this._context3D.setVertexBufferAt("va1", this._uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);

            this._context3D.drawTriangles(this._indexBuffer, 0, nChildren * 2);
        };

        GPUSpriteRenderLayer.prototype.setupShaders = function () {
            this._shaderProgram = this._context3D.createProgram();

            this._shaderProgram.upload("shader-vs", "shader-fs");
        };

        GPUSpriteRenderLayer.prototype.updateTexture = function () {
            this._spriteSheet.uploadTexture(this._context3D);
        };

        GPUSpriteRenderLayer.prototype.updateChildVertexData = function (sprite) {
            var childVertexIdx = sprite._childId * 12;

            if (sprite.visible) {
                var x = sprite.position.x;
                var y = sprite.position.y;
                var rect = sprite.rect;
                var sinT = Math.sin(sprite.rotation);
                var cosT = Math.cos(sprite.rotation);
                var alpha = 0;

                var scaledWidth = rect.width * sprite.scaleX;
                var scaledHeight = rect.height * sprite.scaleY;
                var centerX = scaledWidth * 0.5;
                var centerY = scaledHeight * 0.5;

                this._vertexData[childVertexIdx] = x - (cosT * centerX) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 1] = y - (sinT * centerX) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 2] = alpha;

                this._vertexData[childVertexIdx + 3] = x - (cosT * centerX) + (sinT * centerY);
                this._vertexData[childVertexIdx + 4] = y - (sinT * centerX) - (cosT * centerY);
                this._vertexData[childVertexIdx + 5] = alpha;

                this._vertexData[childVertexIdx + 6] = x + (cosT * (scaledWidth - centerX)) + (sinT * centerY);
                this._vertexData[childVertexIdx + 7] = y + (sinT * (scaledWidth - centerX)) - (cosT * centerY);
                this._vertexData[childVertexIdx + 8] = alpha;

                this._vertexData[childVertexIdx + 9] = x + (cosT * (scaledWidth - centerX)) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 10] = y + (sinT * (scaledWidth - centerX)) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 11] = alpha;
            } else {
                for (var i = 0; i < 12; i++) {
                    this._vertexData[childVertexIdx + i] = 0;
                }
            }
        };
        return GPUSpriteRenderLayer;
    })();
    GPUSprite.GPUSpriteRenderLayer = GPUSpriteRenderLayer;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var GPUSpriteRenderStage = (function () {
        function GPUSpriteRenderStage(stage3D, context3D, rect) {
            this._stage3D = stage3D;
            this._context3D = context3D;
            this._layers = [];
            this.position = rect;
        }
        Object.defineProperty(GPUSpriteRenderStage.prototype, "position", {
            get: function () {
                return this._rect;
            },
            set: function (rect) {
                this._rect = rect;

                this.configureBackBuffer(rect.width, rect.height);
                this._modelViewMatrix = new stageJS.geom.Matrix3D();
                this._modelViewMatrix.appendTranslation(-rect.width / 2, -rect.height / 2, 0);
                this._modelViewMatrix.appendScale(2.0 / rect.width, -2.0 / rect.height, 1);
                console.log(this._modelViewMatrix.rawData);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(GPUSpriteRenderStage.prototype, "modelViewMatrix", {
            get: function () {
                return this._modelViewMatrix;
            },
            enumerable: true,
            configurable: true
        });

        GPUSpriteRenderStage.prototype.addLayer = function (layer) {
            layer.parent = this;
            this._layers.push(layer);
        };

        GPUSpriteRenderStage.prototype.removeLayer = function (layer) {
            for (var i = 0; i < this._layers.length; i++) {
                if (this._layers[i] == layer) {
                    layer.parent = null;
                    this._layers.splice(i, 1);
                }
            }
        };

        GPUSpriteRenderStage.prototype.draw = function () {
            this._context3D.clear(1.0, 1.0, 1.0);
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
            this._context3D.present();
        };

        GPUSpriteRenderStage.prototype.drawDeferred = function () {
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
        };

        GPUSpriteRenderStage.prototype.configureBackBuffer = function (width, height) {
            this._context3D.configureBackBuffer(width, height, 0, false);
        };
        return GPUSpriteRenderStage;
    })();
    GPUSprite.GPUSpriteRenderStage = GPUSpriteRenderStage;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var GPUSpriteSheet = (function () {
        function GPUSpriteSheet(width, height) {
            this._spriteSheet = new stageJS.BitmapData(width, height, true, 0xffff1117);
            this._uvCoords = [];
            this._rects = [];
        }
        GPUSpriteSheet.prototype.addSprite = function (srcBits, srcRect, destPt) {
            this._spriteSheet.copyPixels(srcBits, srcRect, destPt);

            this._rects.push({
                x: destPt.x,
                y: destPt.y,
                width: srcRect.width,
                height: srcRect.height });

            this._uvCoords.push(destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height, destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height);

            return this._rects.length - 1;
        };

        GPUSpriteSheet.prototype.removeSprite = function (spriteId) {
            if (spriteId < this._uvCoords.length) {
                this._uvCoords = this._uvCoords.splice(spriteId * 8, 8);
                this._rects.splice(spriteId, 1);
            }
        };

        Object.defineProperty(GPUSpriteSheet.prototype, "numSprites", {
            get: function () {
                return this._rects.length;
            },
            enumerable: true,
            configurable: true
        });

        GPUSpriteSheet.prototype.getUVCoords = function (spriteId) {
            var startIdx = spriteId * 8;
            return this._uvCoords.slice(startIdx, startIdx + 8);
        };

        GPUSpriteSheet.prototype.getRect = function (spriteId) {
            return this._rects[spriteId];
        };

        GPUSpriteSheet.prototype.uploadTexture = function (context3D) {
            if (this._texture == null) {
                this._texture = context3D.createTexture(this._spriteSheet.width, this._spriteSheet.height, stageJS.Context3DTextureFormat.BGRA, false);
            }

            this._texture.uploadFromBitmapData(this._spriteSheet, 0);
        };
        return GPUSpriteSheet;
    })();
    GPUSprite.GPUSpriteSheet = GPUSpriteSheet;
})(GPUSprite || (GPUSprite = {}));
var BunnyMark;
(function (BunnyMark) {
    var BunnySprite = (function () {
        function BunnySprite(gs) {
            this._gpuSprite = gs;
            this._speedX = 0;
            this._speedY = 0;
        }
        Object.defineProperty(BunnySprite.prototype, "speedX", {
            get: function () {
                return this._speedX;
            },
            set: function (sx) {
                this._speedX = sx;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(BunnySprite.prototype, "speedY", {
            get: function () {
                return this._speedY;
            },
            set: function (sy) {
                this._speedY = sy;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(BunnySprite.prototype, "sprite", {
            get: function () {
                return this._gpuSprite;
            },
            set: function (gs) {
                this._gpuSprite = gs;
            },
            enumerable: true,
            configurable: true
        });

        return BunnySprite;
    })();
    BunnyMark.BunnySprite = BunnySprite;
})(BunnyMark || (BunnyMark = {}));
var BunnyMark;
(function (BunnyMark) {
    var BunnyLayer = (function () {
        function BunnyLayer(view) {
            this.gravity = 0.5;
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
            this._bunnies = [];
        }
        BunnyLayer.prototype.setPosition = function (view) {
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
        };

        BunnyLayer.prototype.createRenderLayer = function (context3D) {
            this._spriteSheet = new GPUSprite.GPUSpriteSheet(64, 64);

            var bunnyBitmap = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
            var bunnyRect = { x: 0, y: 0, width: bunnyBitmap.width, height: bunnyBitmap.height };

            this._bunnySpriteID = this._spriteSheet.addSprite(bunnyBitmap, bunnyRect, { x: 0, y: 0 });

            this._renderLayer = new GPUSprite.GPUSpriteRenderLayer(context3D, this._spriteSheet);
            return this._renderLayer;
        };

        BunnyLayer.prototype.addBunny = function (numBunnies) {
            var currentBunnyCount = this._bunnies.length;
            var bunny;
            var sprite;
            for (var i = currentBunnyCount; i < currentBunnyCount + numBunnies; i++) {
                sprite = this._renderLayer.createChild(this._bunnySpriteID);
                bunny = new BunnyMark.BunnySprite(sprite);
                bunny.sprite.position = { x: 0, y: 0 };
                bunny.speedX = 5;
                bunny.speedY = 5;
                bunny.sprite.scaleX = bunny.sprite.scaleY = Math.random() + 0.3;
                bunny.sprite.rotation = 15 - Math.random() * 30;
                this._bunnies.push(bunny);
            }
        };

        BunnyLayer.prototype.update = function (currentTime) {
            var bunny;
            for (var i = 0; i < this._bunnies.length; i++) {
                bunny = this._bunnies[i];
                bunny.sprite.position.x += bunny.speedX;
                bunny.sprite.position.y += bunny.speedY;
                bunny.speedY += this.gravity;
                bunny.sprite.alpha = 0.3 + 0.7 * bunny.sprite.position.y / this.maxY;
                if (bunny.sprite.position.x > this.maxX) {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.maxX;
                } else if (bunny.sprite.position.x < this.minX) {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.minX;
                }
                if (bunny.sprite.position.y > this.maxY) {
                    bunny.speedY *= -0.8;
                    bunny.sprite.position.y = this.maxY;
                    if (Math.random() > 0.5)
                        bunny.speedY -= 3 + Math.random() * 4;
                } else if (bunny.sprite.position.y < this.minY) {
                    bunny.speedY = 0;
                    bunny.sprite.position.y = this.minY;
                }
            }
        };
        return BunnyLayer;
    })();
    BunnyMark.BunnyLayer = BunnyLayer;
})(BunnyMark || (BunnyMark = {}));
var BunnyMark;
(function (BunnyMark) {
    var Background = (function () {
        function Background(ctx3D, w, h) {
            this.cols = 8;
            this.rows = 12;
            this._timer = new BunnyMark.Timer();
            this.context3D = ctx3D;
            this._width = w;
            this._height = h;

            this.texBM = BunnyMark.ImageLoader.getInstance().get("assets/grass.png");
            this.tex = this.context3D.createTexture(this.texBM.width, this.texBM.height, stageJS.Context3DTextureFormat.BGRA, false);
            this.tex.uploadFromBitmapData(this.texBM, 0);

            this.buildMesh();

            this.shader_program = this.context3D.createProgram();
            this.shader_program.upload("shader-vs", "shader-fs");
            this.context3D.setProgram(this.shader_program);

            this._modelViewMatrix = new stageJS.geom.Matrix3D();
            this._modelViewMatrix.appendTranslation(-(this._width) / 2, -(this._height) / 2, 0);
            this._modelViewMatrix.appendScale(2.0 / (this._width - 50), -2.0 / (this._height - 50), 1);

            this.context3D.setTextureAt("fs0", this.tex);
            this.context3D.setVertexBufferAt("va0", this.vb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setVertexBufferAt("va1", this.uvb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setProgramConstantsFromMatrix("vc0", this._modelViewMatrix, true);
        }
        Background.prototype.buildMesh = function () {
            var uw = this._width / this.texBM.width;
            var uh = this._height / this.texBM.height;
            var kx, ky;
            var ci, ci2, ri;

            this.vertices = [];
            this.uvt = [];
            this.indices = [];

            var i;
            var j;
            for (j = 0; j <= this.rows; j++) {
                ri = j * (this.cols + 1) * 2;
                ky = j / this.rows;
                for (i = 0; i <= this.cols; i++) {
                    ci = ri + i * 2;
                    kx = i / this.cols;
                    this.vertices[ci] = this._width * kx;
                    this.vertices[ci + 1] = this._height * ky;
                    this.uvt[ci] = uw * kx;
                    this.uvt[ci + 1] = uh * ky;
                }
            }
            for (j = 0; j < this.rows; j++) {
                ri = j * (this.cols + 1);
                for (i = 0; i < this.cols; i++) {
                    ci = i + ri;
                    ci2 = ci + this.cols + 1;
                    this.indices.push(ci);
                    this.indices.push(ci + 1);
                    this.indices.push(ci2);
                    this.indices.push(ci + 1);
                    this.indices.push(ci2 + 1);
                    this.indices.push(ci2);
                }
            }

            this.numIndices = this.indices.length;
            this.numTriangles = this.numIndices / 3;
            this.numVertices = this.vertices.length / 2;

            this.vb = this.context3D.createVertexBuffer(this.numVertices, 2);
            this.uvb = this.context3D.createVertexBuffer(this.numVertices, 2);

            this.ib = this.context3D.createIndexBuffer(this.numIndices);
            this.vb.uploadFromVector(this.vertices, 0, this.numVertices);
            this.ib.uploadFromVector(this.indices, 0, this.numIndices);
            this.uvb.uploadFromVector(this.uvt, 0, this.numVertices);
        };

        Background.prototype.render = function () {
            if (this._width == 0 || this._height == 0)
                return;

            var t = this._timer.getTimer() / 1000.0;
            var sw = this._width;
            var sh = this._height;
            var kx, ky;
            var ci, ri;
            this.context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this.context3D.setTextureAt("fs0", this.tex);
            this.context3D.setProgram(this.shader_program);
            this.context3D.setVertexBufferAt("va0", this.vb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setVertexBufferAt("va1", this.uvb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setProgramConstantsFromMatrix("vc0", this._modelViewMatrix, true);

            var i = 0;
            for (var j = 0; j <= this.rows; j++) {
                ri = j * (this.cols + 1) * 2;
                for (i = 0; i <= this.cols; i++) {
                    ci = ri + i * 2;
                    kx = i / this.cols + Math.cos(t + i) * 0.02;
                    ky = j / this.rows + Math.sin(t + j + i) * 0.02;
                    this.vertices[ci] = sw * kx;
                    this.vertices[ci + 1] = sh * ky;
                }
            }
            this.context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this.vb.uploadFromVector(this.vertices, 0, this.numVertices);

            this.context3D.drawTriangles(this.ib, 0, this.numTriangles);
        };
        return Background;
    })();
    BunnyMark.Background = Background;
})(BunnyMark || (BunnyMark = {}));
var BunnyMark;
(function (BunnyMark) {
    var stage3d;
    var context3D;

    var _width = 480;
    var _height = 640;

    var _spriteStage;

    var numBunnies = 100;

    var _bunnyLayer;

    var timer = new BunnyMark.Timer();

    function main() {
        var canvas = document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onContext3DCreate);
        stage3d.requestContext3D();
    }
    BunnyMark.main = main;

    function onContext3DCreate(e) {
        context3D = stage3d.context3D;
        initSpriteEngine();
    }

    function initSpriteEngine() {
        var stageRect = { x: 0, y: 0, width: _width, height: _height };
        _spriteStage = new GPUSprite.GPUSpriteRenderStage(stage3d, context3D, stageRect);
        _spriteStage.configureBackBuffer(_width, _height);

        var view = new BunnyMark.Rectangle(0, 0, _width, _height);
        _bunnyLayer = new BunnyMark.BunnyLayer(view);
        _bunnyLayer.createRenderLayer(context3D);
        _spriteStage.addLayer(_bunnyLayer._renderLayer);
        _bunnyLayer.addBunny(numBunnies);

        requestAnimationFrame(onEnterFrame);
    }

    function doAllTheTime() {
        context3D.clear(0, 0, 0, 0);

        context3D.present();
    }
    function wrapper() {
        doAllTheTime();
        setTimeout(wrapper, 1000);
    }

    function onEnterFrame() {
        requestAnimationFrame(onEnterFrame);
        context3D.clear(0, 1, 0, 1);

        _bunnyLayer.update(timer.getTimer());
        _spriteStage.drawDeferred();
        context3D.present();
    }
})(BunnyMark || (BunnyMark = {}));
var SimpleTest;
(function (SimpleTest) {
    var stage3d;

    var context3D;
    var _width = 480;
    var _height = 640;
    var _spriteStage;

    var _spriteSheet;
    var indexBuffer;

    function main() {
        BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
        BunnyMark.ImageLoader.getInstance().downloadAll(SimpleTest.init);
    }
    SimpleTest.main = main;

    function init() {
        var canvas = document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onContext3DCreate);
        stage3d.requestContext3D();
    }
    SimpleTest.init = init;
    var _bunnyLayer;
    function onContext3DCreate(e) {
        context3D = stage3d.context3D;

        var stageRect = { x: 0, y: 0, width: _width, height: _height };
        _spriteStage = new GPUSprite.GPUSpriteRenderStage(stage3d, context3D, stageRect);

        _spriteSheet = new GPUSprite.GPUSpriteSheet(64, 64);
        var bunnyBitmap = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        var bunnyRect = { x: 0, y: 0, width: bunnyBitmap.width, height: bunnyBitmap.height };
        var _bunnySpriteID = _spriteSheet.addSprite(bunnyBitmap, bunnyRect, { x: 0, y: 0 });

        var c = document.getElementById("test-canvas");
        var ctx = c.getContext("2d");
        ctx.putImageData(_spriteSheet._spriteSheet.imageData, 0, 0);

        var view = new BunnyMark.Rectangle(0, 0, _width, _height);
        _bunnyLayer = new BunnyMark.BunnyLayer(view);
        _bunnyLayer.createRenderLayer(context3D);
        _spriteStage.addLayer(_bunnyLayer._renderLayer);
        _bunnyLayer.addBunny(100);

        requestAnimationFrame(onEnterFrame);
    }

    function debug() {
        context3D.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

        _spriteSheet = new GPUSprite.GPUSpriteSheet(64, 64);
        var bunnyBitmap = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        var bunnyRect = { x: 0, y: 0, width: bunnyBitmap.width, height: bunnyBitmap.height };
        var _bunnySpriteID = _spriteSheet.addSprite(bunnyBitmap, bunnyRect, { x: 0, y: 0 });

        var program = context3D.createProgram();
        program.upload("shader-vs", "shader-fs");

        _spriteSheet.uploadTexture(context3D);

        context3D.setProgram(program);
        context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);

        var modelViewMatrix = new stageJS.geom.PerspectiveMatrix3D();
        modelViewMatrix.orthoRH(2, 2, 1, 1000);
        context3D.setProgramConstantsFromMatrix("vc0", modelViewMatrix, true);

        context3D.setTextureAt("fs0", _spriteSheet._texture);

        var vertexBuffer = context3D.createVertexBuffer(4, 3);
        vertexBuffer.uploadFromVector([
            -13, -18, 0,
            -13, 18, 0,
            13, 18, 0,
            13, -18, 0], 0, 4);

        var _uvData = [];
        var childUVCoords = _spriteSheet.getUVCoords(_bunnySpriteID);
        _uvData.push(childUVCoords[0], childUVCoords[1], childUVCoords[2], childUVCoords[3], childUVCoords[4], childUVCoords[5], childUVCoords[6], childUVCoords[7]);

        var uvBuffer = context3D.createVertexBuffer(_uvData.length / 2, 2);
        uvBuffer.uploadFromVector(_uvData, 0, _uvData.length / 2);

        context3D.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
        context3D.setVertexBufferAt("va1", uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);

        indexBuffer = context3D.createIndexBuffer(6);
        indexBuffer.uploadFromVector([
            0, 1, 2, 0, 2, 3
        ], 0, 6);

        requestAnimationFrame(onEnterFrame);
    }

    function getSpriteSheetID() {
        var bunnyBitmap = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        console.log("bunnyBitmap", bunnyBitmap.width, bunnyBitmap.height);
        var bunnyRect = { x: 0, y: 0, width: bunnyBitmap.width, height: bunnyBitmap.height };
        return _spriteSheet.addSprite(bunnyBitmap, bunnyRect, { x: 0, y: 0 });

        var c = document.getElementById("test-canvas");
        var ctx = c.getContext("2d");
        ctx.putImageData(_spriteSheet._spriteSheet.imageData, 0, 0);
    }

    function onEnterFrame() {
        requestAnimationFrame(onEnterFrame);

        context3D.clear(0, 1, 0, 1);
        _bunnyLayer.update(11);
        _spriteStage.drawDeferred();
        context3D.present();
    }
})(SimpleTest || (SimpleTest = {}));
//# sourceMappingURL=BunnyMark.js.map
