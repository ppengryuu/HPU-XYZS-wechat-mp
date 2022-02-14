<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack" />

		<view class="content">
			<div>
				<p style="margin:0pt; orphans:0; text-align:center; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">服务协议</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">和隐私政策</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">一、声明</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">用户（同以下</span><span style="font-family:等线; font-size:16pt">”</span><span
					 style="font-family:等线; font-size:16pt">您</span><span style="font-family:等线; font-size:16pt">“</span><span style="font-family:等线; font-size:16pt">）在使用</span><span
					 style="font-family:等线; font-size:16pt">HPU</span><span style="font-family:等线; font-size:16pt">盒子</span><span
					 style="font-family:等线; font-size:16pt">（以下简称</span><span style="font-family:等线; font-size:16pt">”</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">“</span><span style="font-family:等线; font-size:16pt">）</span><span
					 style="font-family:等线; font-size:16pt">前，请您务必审阅本服务协议（以下简称</span><span style="font-family:等线; font-size:16pt">“</span><span
					 style="font-family:等线; font-size:16pt">协议</span><span style="font-family:等线; font-size:16pt">”</span><span style="font-family:等线; font-size:16pt">），</span><span
					 style="font-family:等线; font-size:16pt">充分理解各条款内容。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">服务协议由用户与</span><span style="font-family:等线; font-size:16pt">软件</span><span
					 style="font-family:等线; font-size:16pt">所提供的各项服务而签订的相关权利义务规范。用户通过注册或以其他方式使用</span><span style="font-family:等线; font-size:16pt">软件</span><span
					 style="font-family:等线; font-size:16pt">所提供的相关软件服务， （用户在注册过程中确认同意《协议</span><span style="font-family:等线; font-size:16pt">协议&amp;隐私政策</span><span
					 style="font-family:等线; font-size:16pt">》）即表示接受并同意本协议的所有条件和条款，用户有权选择不接受本协议条款，不愿接受本协议条款的，不得注册、访问、使用</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">提供的相关服务。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">软件运营方（以下简称“我们”）</span><span style="font-family:等线; font-size:16pt">有权对本协议条款进行修改，修改后的协议条款明确由您确认同意后即有效代替原来的协议条款。用户可随时查阅最新协议。
					</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">二、服务内容</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">用户在同意协议后，可以使用软件提供的服务和功能，</span><span style="font-family:等线; font-size:16pt">软</span><span
					 style="font-family:等线; font-size:16pt">件使用自己的软件系统，通过</span><span style="font-family:等线; font-size:16pt">互联网，手机软件等方式给用户提供服务。主要服务内容有</span><span
					 style="font-family:等线; font-size:16pt">：</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">1、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">成绩：您可以</span><span
					 style="font-family:等线; font-size:16pt">在此</span><span style="font-family:等线; font-size:16pt">查询到您在河南理工大学的</span><span
					 style="font-family:等线; font-size:16pt"></span><span style="font-family:等线; font-size:16pt">期末考试成绩，可以查看自己</span><span
					 style="font-family:等线; font-size:16pt">学期成绩，科目成绩</span><span style="font-family:等线; font-size:16pt">的排名</span><span
					 style="font-family:等线; font-size:16pt">，排名仅统计最新一学期所有使用本软件并</span><span
					 style="font-family:等线; font-size:16pt">使用“成绩”查询过成绩的用户，并非真实排名，结果仅供参考。</span></p>
				<p style="margin:0pt 0pt 0pt 20.75pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">2、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">课程表：您可以在此查询到您在河南理工大学本学期的课程表，可以查看课程的详细信息。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">3、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">空教室：您可以在此查询空闲教室，由于空教室为学校共享资源，会可能有其他原因（比如教师课程调整，会议等）导致空教室被占用，结果仅供参考。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">4、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">图书馆：您可以在此</span><span
					 style="font-family:等线; font-size:16pt">查询您</span><span style="font-family:等线; font-size:16pt">在</span><span style="font-family:等线; font-size:16pt">学校图书馆的借阅信息。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">5、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">捡到校园卡：如果您捡到他人丢失的校园卡，可以在这里发布校园卡的信息，</span><span
					 style="font-family:等线; font-size:16pt">注意留下必要的信息，便于失主巡回丢失的校园卡。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">6、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">学校地图：您可以在这里查看学校（河南理工大学）的地图。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">7、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">校历：您可以在这里查看学校（河南理工大学）的校历。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">所有服务内容以下简称</span><span
					 style="font-family:等线; font-size:16pt">”</span><span style="font-family:等线; font-size:16pt">服务”</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">三、</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">用户</span><span style="font-family:等线; font-size:16pt; font-weight:bold">使用规则</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">：</span></p>
				
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">1、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">您表示接受并同意本协议的所有条件和条款才能注册和使用</span><span
					 style="font-family:等线; font-size:16pt">软件和</span><span style="font-family:等线; font-size:16pt">服务。您有权选择不接受本协议条款</span><span
					 style="font-family:等线; font-size:16pt">。</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">2、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="-aw-bookmark-end:_Hlk36025232"></span><span style="font-family:等线; font-size:16pt">用户账户是</span><span
					 style="font-family:等线; font-size:16pt">识别您</span><span style="font-family:等线; font-size:16pt">身份的依据，请您务必妥善保管。使用用户账户进行的操作、发出的指令视为您</span><span
					 style="font-family:等线; font-size:16pt">亲自</span><span style="font-family:等线; font-size:16pt">做出。因您的原因造成的账户、密码等信息被冒用、盗用或非法使用，由此引起的风险和损失需要由您自行承担</span><span
					 style="font-family:等线; font-size:16pt">。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">3、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">为了保障您的账号安全，</span><span
					 style="font-family:等线; font-size:16pt">请妥善保管和设置您的账号和密码。如果因为某些原因您无法登录和找回你的账号和密码，为了保护您的隐私，请及时与</span><span style="font-family:等线; font-size:16pt">我们</span><span
					 style="font-family:等线; font-size:16pt">联系，</span><span style="font-family:等线; font-size:16pt">我们</span><span
					 style="font-family:等线; font-size:16pt">将采取必要措施保护您的隐私安全。</span><span style="font-family:等线; font-size:16pt">
					</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">4、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">基于运行和服务安全的需要，</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">服务部分功能</span><span
					 style="font-family:等线; font-size:16pt">可能会暂停或取消</span><span style="font-family:等线; font-size:16pt">，或增加新的功能。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">5、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">您在注册、使用我们服务的过程中，请您提供合法、真实、有效、准确并完整的资料。您应确保账户绑定的</span><span
					 style="font-family:等线; font-size:16pt">邮箱</span><span style="font-family:等线; font-size:16pt">均为您</span><span
					 style="font-family:等线; font-size:16pt">所</span><span style="font-family:等线; font-size:16pt">持有，如您占用了他人</span><span
					 style="font-family:等线; font-size:16pt">邮箱</span><span style="font-family:等线; font-size:16pt">的，为避免给</span><span
					 style="font-family:等线; font-size:16pt">邮箱</span><span style="font-family:等线; font-size:16pt">持有人带来不便或不利影响，也为了您的信息安全，</span><span
					 style="font-family:等线; font-size:16pt">我们</span><span style="font-family:等线; font-size:16pt">可能将该</span><span
					 style="font-family:等线; font-size:16pt">邮箱</span><span style="font-family:等线; font-size:16pt">从您的账户中删除并解除关联。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">6、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">您需要遵守中华人民共和国相关法律法规及您所属、所居住或开展经营活动或其他业务的国家或地区的法律法规，不得将我们的服务用于非法目的，也不得以非法方式使用我们的服务。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">7、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">您不得</span><span style="font-family:等线; font-size:16pt">利用我们的服务从事侵害他人合法权益或违反国家法律法规的行为，否则</span><span
					 style="font-family:等线; font-size:16pt">我们</span><span style="font-family:等线; font-size:16pt">有权进行调查、延迟或拒绝或停止提供服务，且您需要自行承担相关法律责任，如导致我们或其他方受损的，您需要承担赔偿责任</span><span
					 style="font-family:等线; font-size:16pt">。</span></p>
				
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">8、</span><span
					 style="font:7.0pt 'Times New Roman'">&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0; </span><span style="font-family:等线; font-size:16pt">您不得</span><span
					 style="font-family:等线; font-size:16pt">通过任何手段恶意注册</span><span style="font-family:等线; font-size:16pt">软件</span><span
					 style="font-family:等线; font-size:16pt">账号</span><span style="font-family:等线; font-size:16pt">，包括但不限于以牟利、炒作等为目的恶意注册多个账号。用户亦不得恶意盗用其他用户</span><span
					 style="font-family:等线; font-size:16pt">账号</span><span style="font-family:等线; font-size:16pt">。</span></p>
				<p style="margin:0pt 0pt 0pt 21.25pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">9、</span><span
					 style="font:7.0pt 'Times New Roman'">&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0; </span><span style="font-family:等线; font-size:16pt">您不得</span><span
					 style="font-family:等线; font-size:16pt">将</span><span style="font-family:等线; font-size:16pt">本软件</span><span style="font-family:等线; font-size:16pt">以任何形式作为从事各种非法活动的场所、平台或媒介。未经</span><span
					 style="font-family:等线; font-size:16pt">我们</span><span style="font-family:等线; font-size:16pt">的授权或许可，不得借用本站的名义从事任何商业活动，也不得以任何形式将</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">作为从事商业活动的场所、平台或媒介。</span></p>
					 
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 39.25pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">10、</span><span
					 style="font:7.0pt 'Times New Roman'">&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;&#xa0; </span><span style="font-family:等线; font-size:16pt">您不得</span><span
					 style="font-family:等线; font-size:16pt">恶意使用“捡到校园卡”功能向</span><span style="font-family:等线; font-size:16pt">其他</span><span
					 style="font-family:等线; font-size:16pt">用户恶意推送不良或违法信息等，否则将对您的账号进行暂停或查封。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">四、用户个人隐私信息保护</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">您在使用本软件和服务的过程中，可能需要填写或提交一些重要的或隐私的信息，比如学号密码，软件将不会在后台数据库中储存这些信息，软件提供的记住密码功能会通过本地存储的方式进行存储。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">用户个人隐私是十分重要的，</span><span style="font-family:等线; font-size:16pt">我们</span><span
					 style="font-family:等线; font-size:16pt">也十分注重和尊重您的个人隐私，并将采取措施保护您的隐私</span><span style="font-family:等线; font-size:16pt">，未经过您</span><span
					 style="font-family:等线; font-size:16pt">本人</span><span style="font-family:等线; font-size:16pt">的同意，不会向他人提供有关您隐私的信息（</span><span
					 style="font-family:等线; font-size:16pt">以下情况除外</span><span style="font-family:等线; font-size:16pt">）</span><span
					 style="font-family:等线; font-size:16pt">:</span></p>
				
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">1、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">在涉及国家安全与利益、社会公共利益、与犯罪侦查有关的相关活动、您或他人生命财产安全但在特殊情</span><span
					 style="font-family:等线; font-size:16pt">况下无法获得您的及时授权、能够从其他合法公开的渠道、法律法规规定的其他情形下，</span><span style="font-family:等线; font-size:16pt">我们</span><span
					 style="font-family:等线; font-size:16pt">可能在不经过您的同意或授权的前提下，向相关部门提供您的个人信息</span><span style="font-family:等线; font-size:16pt">。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; text-indent:32pt; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt 0pt 0pt 38.75pt; orphans:0; text-align:justify; text-indent:-18pt; widows:0"><span style="font-family:等线; font-size:16pt">2、</span><span
					 style="font:7.0pt 'Times New Roman'"> </span><span style="font-family:等线; font-size:16pt">用户主动泄露给他人或第三方关于自己账户及密码而造成隐私泄露的，主动</span><span
					 style="font-family:等线; font-size:16pt">泄露个人隐私内容的，用户账号或设备遭到黑客攻击而造成隐私泄露的。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">五、不可抗力、免责</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">及</span><span style="font-family:等线; font-size:16pt; font-weight:bold">责任限制</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">（一）免责条款</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">
						您明示理解并同意因下列原因导致我们无法正常提供服务，我们免于承担责任：</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">
						1、我们的系统停机维护或升级；</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">
						2、因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">
						3、您的电脑软硬件和通信线路、供电线路出现故障</span><span style="font-family:等线; font-size:16pt">的；</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">
						4、因您操作不当或通过非经我们授权或认可的方式使用我们服务的；因病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、第三</span><span style="font-family:等线; font-size:16pt">方服务</span><span
					 style="font-family:等线; font-size:16pt">瑕疵或政府行为等原因。尽管有前款约定，我们将采取合理行动积极促使服务恢复正常。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt"> </span><span
					 style="font-family:等线; font-size:16pt">5</span><span style="font-family:等线; font-size:16pt">、在确认得到您的授权下，</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">通过非官方渠道查询所提供的成绩查询结果、课表信息（包括但不限于）仅作为参考，请您以官方渠道所提供的官方数据为准，</span><span
					 style="font-family:等线; font-size:16pt">软件</span><span style="font-family:等线; font-size:16pt">对此等信息的准确性、完整性、合法性或真实性均不承担责任。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">六</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">、法律适用与责任</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。因本协议产生的争议，均应依照中华人民共和国法律予以处理</span><span
					 style="font-family:等线; font-size:16pt">。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">由用户违反规定造成的法律责任，</span><span style="font-family:等线; font-size:16pt">如若给</span><span
					 style="font-family:等线; font-size:16pt">我们或他人</span><span style="font-family:等线; font-size:16pt">造成损失的，也应当由该用户给予一定的赔偿。</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt; font-weight:bold">七</span><span
					 style="font-family:等线; font-size:16pt; font-weight:bold">、联系我</span><span style="font-family:等线; font-size:16pt; font-weight:bold">们</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="font-family:等线; font-size:16pt">&#xa0;</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="font-family:等线; font-size:16pt">当您有其他疑问</span><span style="font-family:等线; font-size:16pt">、</span><span
					 style="font-family:等线; font-size:16pt">投诉，或需要帮助时，请联系我</span><span style="font-family:等线; font-size:16pt">们</span><span
					 style="font-family:等线; font-size:16pt">：</span></p>
				<p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span style="width:21pt; text-indent:0pt; display:inline-block"></span><span
					 style="width:21pt; text-indent:0pt; display:inline-block"></span><span style="font-family:等线; font-size:16pt">邮箱：e</span><span
					 style="font-family:等线; font-size:16pt">aveliu@126.com</span></p>
			</div>
			<div class="cnzz" style="display: none;"></div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: "",
				config: {
					title: "协议和政策", //title
					bgcolor: "#f8f8f8", //背景颜色
					fontcolor: '#0c0c0c',
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					buttons: [{
						iconfont: "icon-fanhui",
						text: "返回"
					}]
				},
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content span {
		font-size: 28rpx !important;
	}

	.content div {
		font-size: 28rpx !important;
	}

	.content p {
		font-size: 28rpx !important;
	}

	.content {
		margin: 20rpx 30rpx;
	}
</style>
