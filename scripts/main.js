const ui = require("ui-lib/library");

const core = require("pictologic/core");

var ptl;

ui.addMenuButton("图片逻辑化", "paste", () => {
	ptl.show();
});

ui.onLoad(() => {
	// Add button in Schematics dialog
	Vars.ui.schematics.buttons.button("图片逻辑化", Icon.paste, () => {
		ptl.show();
	});

	ptl = new BaseDialog("PicToLogic");

	ptl.cont.add("[coral]1.[] 选择一张png格式图片,非正方形会被拉伸.");
	ptl.cont.row();
	ptl.cont.add("[coral]2.[] 单击 [stat]转换[] 来将图片变成蓝图.");
	ptl.cont.row();
	ptl.cont.add("[coral]请正常点使用这工具,谢谢(禁止福瑞!)");
	ptl.cont.row();

	ptl.cont.button("选择图片(png)", () => {
		readBinFile("Schematic's source image", "png", bytes => {
			try {
				core.image = new Pixmap(bytes);
			} catch (e) {
				ui.showError("加载源图片失败", e);
			}
		});
	}).size(240, 50);
	ptl.cont.row();

	ptl.cont.label(() => core.stage).center();

	ptl.addCloseButton();
	ptl.buttons.button("设置", Icon.settings, () => {
		core.settings.show();
	});
	ptl.buttons.button("转换", Icon.export, () => {
		new java.lang.Thread(() => {
			try {
				core.export(core.image);
				ptl.hide();
			} catch (e) {
				Core.app.post(() => {
					ui.showError("蓝图化转换失败", e);
					core.stage = "";
				});
			}
		}, "PicToLogic worker").start();
	}).disabled(() => !core.image || core.stage != "");

	core.build();
});
