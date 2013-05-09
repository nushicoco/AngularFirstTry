Debugger.Profiler=Debugger.Plugins.register(Debugger.PluginType.PROFILING,null,function(){var C=function(J){var L=null;var I=0;var E=0;var G=1000000;var F=0;var H=[];var K=null;var D={methodName:J,start:function(){L=new Date().getTime();K=new C.Entry(this.methodName,L);I++},finalize:function(){K.endTime=new Date().getTime();K.totalTime=K.endTime-K.startTime;E+=(K.endTime-K.startTime);if(K.totalTime>F){F=K.totalTime}if(K.totalTime<G){G=K.totalTime}H.push(K)},getTotalTime:function(){return E},getExecutionCount:function(){return I}};return D};C.Entry=function(E,F){var D={methodName:E,startTime:F||(new Date().getTime()),endTime:0,totalTime:0};return D};var B=[];var A={push:function(D){},pop:function(D){},prolog:function(D){if(!B[D.name]){B[D.name]=new C(D.name)}B[D.name].start()},epilog:function(D){if(!B[D.name]){Debugger.raiseError("Profiler couldn't find the method descriptor.")}B[D.name].finalize()},getProfile:function(D){return B[D]||null}};return A}());
Debugger.Tracert=Debugger.Plugins.register(Debugger.PluginType.TRACING,null,function(){var B=function(E,D){var C={methodName:D,previous:null,toString:function(){return this.methodName}};return C};var A={push:function(C){var D=new B(C.method,C.methodName);var E=C.context.stack;D.previous=E.slice(E.length-1)[0];E.push(D)},pop:function(C){C.context.stack.pop()}};return A}());
Debugger={};Debugger.Utils={extend:function(C,B){for(var A in B){if(B.hasOwnProperty(A)){if(!C[A]){C[A]=B[A]}else{if(C[A] instanceof Function){C[A]=this.wrap(C[A],B[A])}}}}},wrap:function(B,A){return function(){var E=new Array(arguments.length);for(var D=0,C=arguments.length;D<C;D++){E[D]=arguments[D]}E=[B].concat(E);return A.apply(this,E)}}};Debugger.Utils.extend(Debugger,function(){var D=[];var A=false;var C=null;var B={setup:function(){if(A){return }if(!Object.prototype){Object.prototype={}}Debugger.Utils.extend(Object.prototype,Debugger.Prototype);A=true},attach:function(E,F){Debugger.Prototype.debug.apply(E,[F]);A=true},detach:function(E){if(!this.isDebugging(E)){this.raiseError("Debugger is not attached to the specified object.")}var F=Debugger.Cache.get(E);F.restore();Debugger.Cache.release(E)},isDebugging:function(E){return Debugger.Cache.exists(E)},isEnabled:function(){return A},Plugins:{add:function(F,E){if(!D[F]){D[F]=[]}D[F].push(E);return D[F]},call:function(J,G,E){var F=D[J];if(!F&&(J==Debugger.PluginType.DEBUGGING)){F=this.add(Debugger.PluginType.DEBUGGING,new Debugger.GenericDebugger())}else{if(!F){return }}E.event=G;for(var I=0,H=F.length;I<H;I++){if(F[I][G]){F[I][G](E)}else{F[I].execute(E)}}},create:function(G,I){var J=G;var F=I;if(arguments.length===1){J=null;F=G}var H=function(){};if(J){var E=function(){};E.prototype=J.prototype;H.prototype=new E()}Debugger.Utils.extend(H.prototype,F);return H},register:function(I,E,H){var G=this.create(E,H);var F=new G();this.add(I,F);return F}},raiseError:function(E,F){var G=E;if(F){G="["+F+"] "+G}throw G},disable:function(){if(!A){Debugger.raiseError("Debugger is not enabled.")}Debugger.Cache.free(function(F){F.restore()});for(var E in Debugger.Prototype){if(Debugger.Prototype.hasOwnProperty(E)){if(Object[E]){delete Object[E]}}}A=false},setGlobalContext:function(E){if(E instanceof Debugger.Context){C=E}},getGlobalContext:function(){return C}};return B}());Debugger.Prototype={debug:function(B){if(!B){B=Debugger.getGlobalContext()}if(!(B instanceof Debugger.Context)){throw"Invalid Context specified."}if(!B||!B.enableDebugging){return }if(Debugger.Cache.exists(this)){Debugger.raiseError("Object is already being debugged.")}Debugger.Cache.add(this);B.addTarget(this);for(var A in this){if(this.hasOwnProperty(A)){if(this[A] instanceof Function){this[A]=B.wrap(this,this[A],A)}else{if(this[A]&&B.intrusive&&(this[A].constructor===Object)){Debugger.attach(this[A],B)}}}}}};Debugger.Events={ERROR:"error",PROLOG:"prolog",EPILOG:"epilog",PUSH:"push",POP:"pop"};Debugger.PluginType={DEBUGGING:1,TRACING:2,PROFILING:3,UTILITY:4,ADAPTER:5};Debugger.Context=function(E){var C=[];var B=[];var D=function(H,K,F){var L=new Debugger.Event(H,K,F);var G=B[H];for(var J=0,I=G.length;J<I;J++){G[J].apply(K,[L])}};var A={enableTracing:false,enableProfiling:false,enableDebugging:true,intrusive:false,stack:[],addTarget:function(F){C.push(F)},addHandler:function(F,G){if(!B[F]){B[F]=[]}B[F].push(G)},onError:function(F){this.addHandler(Debugger.Events.ERROR,F)},wrap:function(F,I,H){var G=this;return function(){var J;var K={context:G,method:I,name:H};try{Debugger.Plugins.call(Debugger.PluginType.DEBUGGING,Debugger.Events.PROLOG,K);if(G.enableProfiling){Debugger.Plugins.call(Debugger.PluginType.PROFILING,Debugger.Events.PROLOG,K)}J=I.apply(F,arguments);Debugger.Plugins.call(Debugger.PluginType.DEBUGGING,Debugger.Events.EPILOG,K);if(G.enableProfiling){Debugger.Plugins.call(Debugger.PluginType.PROFILING,Debugger.Events.EPILOG,K)}}catch(M){if(G.enableDebugging){var L=new Debugger.Error(this,M,G.stack);D(Debugger.Events.ERROR,this,L)}else{Debugger.raiseError(M.toString())}}return J}},push:function(H,F){if(this.enableTracing){var G={method:H,methodName:F,wrapper:this};Debugger.Plugins.call(Debugger.PluginType.TRACING,Debugger.Events.PUSH,G);if(this.enableProfiling){Debugger.Plugins.call(Debugger.PluginType.PROFILING,Debugger.Events.PUSH,G)}}},pop:function(){if(this.enableTracing){var F={context:this};Debugger.Plugins.call(Debugger.PluginType.TRACING,Debugger.Events.POP,F);if(this.enableProfiling){Debugger.Plugins.call(Debugger.PluginType.PROFILING,Debugger.Events.POP,F)}}}};if(E){A.onError(E)}Debugger.Utils.extend(this,A);return this};Debugger.Wrapper=Debugger.Context;Debugger.Event=function(C,D,A){var B={eventId:C,source:D,data:A};return B};Debugger.Error=function(D,C,B){var A={error:C,stack:B,source:D};return A};Debugger.Cache=function(){var B=[];var A={exists:function(C){return this.get(C)?true:false},add:function(C){B.push(new Debugger.Cache.Entry(C))},get:function(C){for(var E=0,D=B.length;E<D;E++){if(B[E]&&(B[E].getObject()===C)){return B[E]}}return null},release:function(C){if(!this.exists(C)){return }for(var E=0,D=B.length;E<D;E++){if(B[E].getObject()===C){delete B[E];break}}},each:function(C,E){for(var F=0,D=B.length;F<D;F++){if(B[F]){C.apply(E||window,[B[F],F])}}},free:function(D){for(var E=0,C=B.length;E<C;E++){if(B[E]){D(B[E]);delete B[E]}}}};return A}();Debugger.Cache.Entry=function(A){var E=[];var D=A;var B={getObject:function(){return D},restore:function(){for(var F in E){if(E.hasOwnProperty(F)&&D.hasOwnProperty(F)){D[F]=E[F]}}}};for(var C in A){if(A.hasOwnProperty(C)&&typeof D[C]==="function"){E[C]=D[C]}}return B};Debugger.GenericDebugger=Debugger.Plugins.create(null,{prolog:function(A){if(A.context.enableDebugging){A.context.push(A.method,A.name)}},epilog:function(A){if(A.context.enableDebugging){A.context.pop()}}});Debugger.Adapter={};
Debugger.Adapter.Prototype=function(){var B=new Debugger.Context();var C=function(E){if(!E.prototype){return E}var F=E.prototype.initialize;if(!F){return E}E.prototype.initialize=Debugger.Utils.wrap(F,function($super){var I=[];for(var H=1,G=arguments.length;H<G;H++){I.push(arguments[H])}if(!Debugger.isDebugging(this)){Debugger.attach(this,B)}$super.apply(this,I)});return E};var D=function(E,G){for(var F in E){if(E.hasOwnProperty(F)){if(typeof E[F]=="object"){D(E[F],G)}if(!G){G=/.*/}if(typeof E[F]=="function"&&G.test(F)){E[F]=C(E[F])}}}};var A={setup:function(E,F){if(typeof E=="function"){E=C(E)}else{D(E,F)}},addErrorHandler:function(E){B.addHandler(Debugger.Events.ERROR,E)}};return A}();
