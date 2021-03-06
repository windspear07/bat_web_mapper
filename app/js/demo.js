/**
 * Created by wind on 2016/10/17.
 */
$(function () {

    //form json化
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [ o[this.name] ];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    ///做图版
    var container = document.getElementById('main_panel');
    //当前area
    var current_area_name;
    ///当前节点信息
    var selected_node_id = '';
    var selected_node_x;
    var selected_node_y;

    //做图数据缓存
    var nodes;
    var edges;
    var data;
    var network;

    //form
    var $form = $("#room_form");

    //生成测试节点
    function getTestNode() {
        //random id
        var id="room:" + (Math.floor(Math.random() * 60000) ).toString();

        var demo = {
            //room id
            id: id,
            areaName : "newbie area",
            shortDesc: id + ", short desc blah.....",
            longDesc: id + ", long desc, wow wowo wow wow ....",
            isEntrance : false,
            path : id + " north;east;south;",
            isCurrent : true,
            isDrawn : true,
            isIndoor : false,
            picked : false,
            exits: id + ',s,n,e,ne,enter',
            note : id + " just a new room, i like it",
            label: id ,
            title: '这是title字段！<br>可以将详细内容<br>放在这里的',
            image: './test/img/qqjiamo' + (Math.floor(Math.random() * 60) + 10) + '.jpg',
            shape: 'image',
            detail_url: 'http:///www.qq.com',
            x: 0 ,
            y: 0
        };

        return demo;
    }

    //todo
    //添加新room
    function addRoom( newRoom ) {
        //非空判断
        if( JSON.stringify(newRoom) == "{}"){
            return;
        }

        //是否需要切换area
        if( newRoom.areaName !== current_area_name ){
            moveArea(newRoom.areaName);
        }

        //if the room is already in the map
        var exist = false;
        $.each( network.nodes._data, function (k,v) {
           //判断id,如果存在则返回
            if( k === newRoom.id ){
                console.log('this node is already in the room. ');
                exist = true;
            }
        });

        //开始画新的点
        if(!exist){
            //从当前节点开始画，判断方向 nswe other
            //根据方向，参考当前节点，计算新的坐标
            //如果坐标有房间，则半径*1.5， 角度+37（与45互质）
            //根据室内外，切换不同的图片
            //add node to network
        }

        //添加新的线
        exist = false;
        $.each( network.edges._data, function (k,v) {
            //判断是一根线
            //from 、to都一样
            //描述内容也一样
        });

        //计算path

        //划线
        if(!exist){
            // data.edges.add({
            //     from: selected_node_id,
            //     to: new_node.id,
            //     label:direction,
            //     arrows:'to'
            // });
        };

        //update

        //切换为当前选定的点
        pickRoom(newRoom.id);

        //3s后回传本节点、edge信息给服务器
    }

    //切换区域
    function moveArea( areaName ) {

        //load area 数据

        //加载新数据
    }

    //todo
    //切换到指定room
    function pickRoom( roomId ) {

    }

    //测试添加第一个节点
    $("#test_add_first").on( "click", function (e) {
        data.nodes.add( getTestNode() );

        e.stopPropagation();
    });


    //测试添加节点
    $("#test_add_node").on( "click", function (e) {

        if (selected_node_id === '' || selected_node_id === undefined) {
            alert('please select a node first！');
            return;
        }

        var cur_node = data.nodes.get(selected_node_id);

        //创建新节点
        var new_node = getTestNode();

        //从form获取测试数据
        // var data_from_form = $form.serializeObject();
        // new_node.areaName = data_from_form.areaName;
        // new_node.shortDesc = data_from_form.shortDesc;
        // new_node.longDesc = data_from_form.longDesc;
        // new_node.exits = data_from_form.exits;
        // new_node.note = data_from_form.note;
        // new_node.path = data_from_form.path;

        //模拟生成随机方向 n s e w enter
        var dirs = ['north','south','east','west','enter'];
        var direction = dirs[(Math.floor(Math.random() * 5) )];

        //新点的坐标
        new_node.x = cur_node.x;
        new_node.y = cur_node.y;

        if( direction === 'north' ){
            new_node.y = new_node.y - 150;
        }else if( direction === 'south' ){
            new_node.y = new_node.y + 150;
        }else if( direction === 'east' ){
            new_node.x = new_node.x  + 150;
        }else if( direction === 'west' ){
            new_node.x = new_node.x - 150;
        }else{
            new_node.x = new_node.x + 150 * Math.cos( 45 * Math.PI / 180) * 1.414;
            new_node.y = new_node.y + 150 * Math.cos( 45 * Math.PI / 180) * 1.414;
        }

        data.nodes.add(new_node);

        data.edges.add({
            from: selected_node_id,
            to: new_node.id,
            label:direction,
            arrows:'to'
        });

        //更新节点
        data.nodes.update(
            {
                id: selected_node_id
            }
        );

        console.log("add node ok.");
        e.stopPropagation();
    });


    //测试添加第一个节点
    $("#test_save").on( "click", function (e) {
        var nodes_save = [];
        $.each( data.nodes._data, function (k,v) {
            nodes_save.push(v);
        });

        console.log("eee ", data.edges._data);
        console.log("result ", nodes_save);
        console.log("result json ", JSON.stringify(nodes_save));


        var edges_save = [];
        $.each( data.edges._data, function (k,v) {
            edges_save.push(v);
        });


        console.log("result ", edges_save);
        console.log("result json ", JSON.stringify(edges_save));

        e.stopPropagation();
    });

    $("#test_clear").on("click",function (e) {
        init([],[]);
        e.stopPropagation();
    });

    $("#test_load").on("click",function (e) {
        var nodes_str = " [{\"id\":\"room:38844\",\"areaName\":\"newbie area\",\"shortDesc\":\"room:38844, short desc blah.....\",\"longDesc\":\"room:38844, long desc, wow wowo wow wow ....\",\"isEntrance\":false,\"path\":\"room:38844 north;east;south;\",\"isCurrent\":true,\"isDrawn\":true,\"isIndoor\":false,\"picked\":false,\"exits\":\"room:38844,s,n,e,ne,enter\",\"note\":\"room:38844 just a new room, i like it\",\"label\":\"room:38844\",\"title\":\"这是title字段！<br>可以将详细内容<br>放在这里的\",\"image\":\"./test/img/qqjiamo14.jpg\",\"shape\":\"image\",\"detail_url\":\"http:///www.qq.com\",\"x\":0,\"y\":0},{\"id\":\"room:57460\",\"areaName\":\"newbie area\",\"shortDesc\":\"room:57460, short desc blah.....\",\"longDesc\":\"room:57460, long desc, wow wowo wow wow ....\",\"isEntrance\":false,\"path\":\"room:57460 north;east;south;\",\"isCurrent\":true,\"isDrawn\":true,\"isIndoor\":false,\"picked\":false,\"exits\":\"room:57460,s,n,e,ne,enter\",\"note\":\"room:57460 just a new room, i like it\",\"label\":\"room:57460\",\"title\":\"这是title字段！<br>可以将详细内容<br>放在这里的\",\"image\":\"./test/img/qqjiamo18.jpg\",\"shape\":\"image\",\"detail_url\":\"http:///www.qq.com\",\"x\":149.97734828966674,\"y\":149.97734828966674},{\"id\":\"room:763\",\"areaName\":\"newbie area\",\"shortDesc\":\"room:763, short desc blah.....\",\"longDesc\":\"room:763, long desc, wow wowo wow wow ....\",\"isEntrance\":false,\"path\":\"room:763 north;east;south;\",\"isCurrent\":true,\"isDrawn\":true,\"isIndoor\":false,\"picked\":false,\"exits\":\"room:763,s,n,e,ne,enter\",\"note\":\"room:763 just a new room, i like it\",\"label\":\"room:763\",\"title\":\"这是title字段！<br>可以将详细内容<br>放在这里的\",\"image\":\"./test/img/qqjiamo34.jpg\",\"shape\":\"image\",\"detail_url\":\"http:///www.qq.com\",\"x\":299.9546965793335,\"y\":299.9546965793335},{\"id\":\"room:19446\",\"areaName\":\"newbie area\",\"shortDesc\":\"room:19446, short desc blah.....\",\"longDesc\":\"room:19446, long desc, wow wowo wow wow ....\",\"isEntrance\":false,\"path\":\"room:19446 north;east;south;\",\"isCurrent\":true,\"isDrawn\":true,\"isIndoor\":false,\"picked\":false,\"exits\":\"room:19446,s,n,e,ne,enter\",\"note\":\"room:19446 just a new room, i like it\",\"label\":\"room:19446\",\"title\":\"这是title字段！<br>可以将详细内容<br>放在这里的\",\"image\":\"./test/img/qqjiamo16.jpg\",\"shape\":\"image\",\"detail_url\":\"http:///www.qq.com\",\"x\":289,\"y\":-115}]";

        var edges_str = " [{\"from\":\"room:38844\",\"to\":\"room:57460\",\"label\":\"enter\",\"arrows\":\"to\",\"id\":\"debca060-a827-4e1b-8bf2-a63552e70d9f\"},{\"from\":\"room:57460\",\"to\":\"room:763\",\"label\":\"enter\",\"arrows\":\"to\",\"id\":\"4bb6530e-0a78-44a1-b118-3941be1c3786\"},{\"from\":\"room:57460\",\"to\":\"room:19446\",\"label\":\"enter\",\"arrows\":\"to\",\"id\":\"f19ee760-45e1-4974-b712-eb0a1ebece28\"}]";

        init( JSON.parse(nodes_str), JSON.parse(edges_str));

        e.stopPropagation();
    });

    ///默认配置
    var options = {
        physics: {
            stabilization: false //自动模式
        },
        edges: {
            smooth: {
                type: 'continuous'
            }
        }
        // ,//配置面板
        // configure: {
        //     filter: function (option, path) {
        //         if (path.indexOf('physics') !== -1) {
        //             return true;
        //         }
        //         if (path.indexOf('smooth') !== -1 || option === 'smooth') {
        //             return true;
        //         }
        //         return false;
        //     },
        //     container: document.getElementById('config')
        // }
    };

    ///初始化
    /**
     *
     * @param nodes 点数组
     * @param edges edges数组
     */
    function init(nodes_input,edges_input) {

        ///包装成dataset
        nodes = new vis.DataSet(nodes_input);
        edges = new vis.DataSet(edges_input);
        data = {
            nodes: nodes,
            edges: edges
        };
        network = new vis.Network(container, data, options);

        network.setOptions({
                physics: {
                    enabled: false
                },
                edges: {
                    smooth: {
                        type: 'continuous'
                    }
                }
            }
        );

        /*
         下面为可以监听的事件
         */
        ///点击事件
        // network.on("click", function (params) {
        //     params.event = "[original event]";
        //     document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
        //
        //     selected_node_id = params.nodes[0];
        //     if (selected_node_id !== null && selected_node_id !== undefined) {///点击的是点
        //         selected_node_x = params.pointer.canvas.x;
        //         selected_node_y = params.pointer.canvas.y;
        //     }
        // });

        ////双击事件，拓展分析
        // network.on("doubleClick", function (params) {
        //     params.event = "[original event]";
        //     document.getElementById('eventSpan').innerHTML = '<h2>doubleClick event:</h2>' + JSON.stringify(params, null, 4);
        // });
        // network.on("oncontext", function (params) {
        //     params.event = "[original event]";
        //     document.getElementById('eventSpan').innerHTML = '<h2>oncontext (right click) event:</h2>' + JSON.stringify(params, null, 4);
        // });
        // network.on("dragStart", function (params) {
        //     params.event = "[original event]";
        //     document.getElementById('eventSpan').innerHTML = '<h2>dragStart event:</h2>' + JSON.stringify(params, null, 4);
        // });
        // network.on("dragging", function (params) {
        //     params.event = "[original event]";
        //     document.getElementById('eventSpan').innerHTML = '<h2>dragging event:</h2>' + JSON.stringify(params, null, 4);
        // });
        //拖拽结束事件，确定当前选定的节点
        network.on("dragEnd", function (params) {
            params.event = "[original event]";
            //document.getElementById('eventSpan').innerHTML = '<h2>dragEnd event:</h2>' + JSON.stringify(params, null, 4);

            //捕捉最后选定的点和坐标
            selected_node_id = params.nodes[0];
            if (selected_node_id !== null && selected_node_id !== undefined) {///点击的是点
                console.log("before ", selected_node_id.x,selected_node_id.y)

                selected_node_x = params.pointer.canvas.x;
                selected_node_y = params.pointer.canvas.y;

                data.nodes.update(
                    {
                        id: selected_node_id,
                        x :params.pointer.canvas.x,
                        y :params.pointer.canvas.y
                    }
                );
            }
        });
        // network.on("zoom", function (params) {
        //     document.getElementById('eventSpan').innerHTML = '<h2>zoom event:</h2>' + JSON.stringify(params, null, 4);
        // });
        // network.on("showPopup", function (params) {
        //     document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
        // });
        // network.on("hidePopup", function () {
        //     console.log('hidePopup Event');
        // });
        // network.on("select", function (params) {
        //     console.log('select Event:', params);
        // });
        //选择节点事件，确定当前选定的节点
        network.on("selectNode", function (params) {
            console.log('selectNode Event:', params);
            //捕捉最后选定的点和坐标
            selected_node_id = params.nodes[0];
            if (selected_node_id !== null && selected_node_id !== undefined) {///点击的是点
                selected_node_x = params.pointer.canvas.x;
                selected_node_y = params.pointer.canvas.y;
            }


            //更新form内容
            var cur_node = data.nodes.get(selected_node_id);
            console.log("node ", cur_node)
            $.each(cur_node, function(k,v) {
                console.log("update get: ", k,v);
                $form.find("[name='" + k + "']").val(v);
            });

        });
        // network.on("selectEdge", function (params) {
        //     console.log('selectEdge Event:', params);
        // });
        // network.on("deselectNode", function (params) {
        //     console.log('deselectNode Event:', params);
        // });
        // network.on("deselectEdge", function (params) {
        //     console.log('deselectEdge Event:', params);
        // });
        // network.on("hoverNode", function (params) {
        //     console.log('hoverNode Event:', params);
        // });
        // network.on("hoverEdge", function (params) {
        //     console.log('hoverEdge Event:', params);
        // });
        // network.on("blurNode", function (params) {
        //     console.log('blurNode Event:', params);
        // });
        // network.on("blurEdge", function (params) {
        //     console.log('blurEdge Event:', params);
        // });
    }

    init([],[]);
});