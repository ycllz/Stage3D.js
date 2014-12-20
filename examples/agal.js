///<reference path="stage3d.d.ts"/>
var test;
(function (test) {
    var agal;
    (function (agal) {
        var stage3d;
        var context3d;
        /**
         *  window.onload entry point
         */
        function main() {
            var str = "part fragment 1 \n" + "tex ft0, v0, fs0 <2d,linear,miplinear,clamp> \n" + "div ft0.xyz, ft0.xyz, ft0.w \n" + "tex ft0, v0, fs1 <2d,linear,miplinear,clamp> \n" + "add ft0.w, ft0.w, fc0.z \n" + "div ft0.xyz, ft0, ft0.w \n" + "sub ft0.w, ft0.w, fc0.z \n" + "sat ft0.xyz, ft0 \n" + "mov ft1.x, ft0.w \n" + "mov ft0.w, ft1.x \n" + "mul ft0, ft0, fc1 \n" + "add ft0, ft0, fc2 \n" + "mov oc, ft0 \n" + "endpart \n" + "part vertex 1 \n" + "m44 op, vt0, vc0 \n" + "endpart";
            var canvas = document.getElementById("my-canvas");
            stage3d = new stageJS.Stage3D(canvas);
            stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
            stage3d.requestContext3D();
        }
        agal.main = main;
        function onCreated(e) {
            context3d = stage3d.context3D;
            context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);
            //Create vertex assembler;
            var vertexAssembler = new stageJS.utils.assembler.AGALMiniAssembler();
            vertexAssembler.assemble(stageJS.Context3DProgramType.VERTEX, "mov op,va0 \n" + "mov v0,va1");
            //Create fragment assembler;
            var fragmentAssembler = new stageJS.utils.assembler.AGALMiniAssembler();
            fragmentAssembler.assemble(stageJS.Context3DProgramType.FRAGMENT, "mov oc,v0");
            var program = context3d.createProgram();
            program.uploadAGAL(vertexAssembler.agalcode, fragmentAssembler.agalcode);
            //program.upload("shader-vs", "shader-fs"); // shaders are in html file
            context3d.setProgram(program);
            var vertexBuffer = context3d.createVertexBuffer(3, 7);
            vertexBuffer.uploadFromVector([
                -1,
                -1,
                0,
                1,
                0,
                0,
                1,
                1,
                -1,
                0,
                0,
                1,
                0,
                1,
                0,
                1,
                0,
                0,
                0,
                1,
                1
            ], 0, 3);
            context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3); // pos
            context3d.setVertexBufferAt("va1", vertexBuffer, 3, stageJS.Context3DVertexBufferFormat.FLOAT_4); // color
            var indexBuffer = context3d.createIndexBuffer(3);
            indexBuffer.uploadFromVector([0, 1, 2], 0, 3);
            context3d.clear(0.0, 0.0, 0.0, 1.0);
            context3d.drawTriangles(indexBuffer);
            context3d.present();
        }
    })(agal = test.agal || (test.agal = {}));
})(test || (test = {}));
window.onload = test.agal.main;
