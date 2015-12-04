-- s_t_:系统用信息表
-- s_l_:系统用日志表
-- s_r_:系统用日志表
-- t_:业务信息表
-- r_:业务关系表
-- d_:字典表

-- 主键用kid 自关联父键用pid 一对多关联主表用bid

CREATE EXTENSION "uuid-ossp";

-- 系统操作员日志表
drop table if exists s_l_sys_operate;
create table s_l_sys_operate (
	id bigserial,
	table_name varchar(50) not null,
	table_id uuid not null,
	type smallint not null default 1,
	content varchar(1000) default '',
	remark varchar(200) default '',
	
	create_time timestamp default now(),
	create_by uuid not null,
	primary key(id)
);
comment on column s_l_sys_operate.table_name is '表名称';
comment on column s_l_sys_operate.table_id is '表主键id';
comment on column s_l_sys_operate.type is '操作类型：1增加 2修改 3删除';
comment on column s_l_sys_operate.content is '操作内容明细 修改时[["字段名", "原始值", "更新值"], ...], 删除时[["字段名", "值"], ...]';
comment on column s_l_sys_operate.remark is '备注';

-- 外部暂时记文件日志

-- 系统菜单表
drop table if exists s_t_menu;
create table s_t_menu (
	id uuid default uuid_generate_v1(),
	pid uuid default null,
	level smallint not null,
	title varchar(50) not null,
	url varchar(255) default '',
	pic varchar(255) default '',
	remark varchar(100) default '',
	sort int default 999,
	
	status smallint not null default '1',
	create_time timestamp default now(),
	create_by uuid not null,
	update_time timestamp,
	update_by uuid,
	primary key(id)
);
comment on column s_t_menu.pid is '父级id';
comment on column s_t_menu.level is '级别：0根 1组 2功能';
comment on column s_t_menu.title is '标题';
comment on column s_t_menu.url is '链接';
comment on column s_t_menu.pic is '图标';
comment on column s_t_menu.status is '状态：0停用 1正常';
comment on column s_t_menu.remark is '备注';
comment on column s_t_menu.sort is '排序号';
insert into s_t_menu (id, pid, level, title, remark, sort, create_by) values ('f4fe7866-8b42-11e5-9565-3c15c2d4ab3e',
	null, 0, '根', '目录树根结点', 0, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_t_menu (id, pid, level, title, remark, sort, create_by) values ('0e14b00e-8b43-11e5-9566-3c15c2d4ab3e',
	'f4fe7866-8b42-11e5-9565-3c15c2d4ab3e', 1, 'RBAC管理', '初始生成分类RBAC组', 100, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_t_menu (id, pid, level, title, remark, sort, create_by) values ('5c3dcec8-8b43-11e5-9567-3c15c2d4ab3e',
	'0e14b00e-8b43-11e5-9566-3c15c2d4ab3e', 2, '菜单管理', '初始生成菜单功能', 101, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_t_menu (id, pid, level, title, remark, sort, create_by) values ('98b051e0-8b44-11e5-9569-3c15c2d4ab3e',
	'0e14b00e-8b43-11e5-9566-3c15c2d4ab3e', 2, '角色管理', '初始生成角色功能', 102, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_t_menu (id, pid, level, title, remark, sort, create_by) values ('93ef6ce6-8b43-11e5-9568-3c15c2d4ab3e',
	'f4fe7866-8b42-11e5-9565-3c15c2d4ab3e', 1, '系统配置', '初始生成分类系统配置', 200, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');

-- 系统角色表
drop table if exists s_t_role;
create table s_t_role (
	id uuid default uuid_generate_v1(),
	pid uuid default null,
	title varchar(50) not null,
	remark varchar(100) default '',
	
	status smallint not null default '1',
	create_time timestamp default now(),
	create_by uuid not null,
	update_time timestamp default null,
	update_by uuid default null,
	primary key(id)
);
comment on column s_t_role.pid is '父级id';
comment on column s_t_role.title is '角色名称';
comment on column s_t_role.status is '状态：0停用 1正常';
comment on column s_t_role.remark is '备注';
insert into s_t_role (id, title, create_by, remark) values ('06cfc952-8b41-11e5-9563-3c15c2d4ab3e', '系统管理员',
	'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e', '初始生成');

-- 系统角色权限关系表
drop table if exists s_r_role_menu;
create table s_r_role_menu (
	id uuid default uuid_generate_v1(),
	menu_id uuid not null,
	role_id uuid not null,
	privilege int default 0,
	
	create_time timestamp default now(),
	create_by uuid not null,
	update_time timestamp default null,
	update_by uuid default null,
	primary key(id)
);
comment on column s_r_role_menu.menu_id is '菜单id';
comment on column s_r_role_menu.role_id is '角色id';
comment on column s_r_role_menu.privilege is '权限：0查询导出 1修改 10(2)删除 100(4)扩展操作...';
insert into s_r_role_menu (menu_id, role_id, privilege, create_by) values ('0e14b00e-8b43-11e5-9566-3c15c2d4ab3e'
	, '06cfc952-8b41-11e5-9563-3c15c2d4ab3e', 3, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_r_role_menu (menu_id, role_id, privilege, create_by) values ('5c3dcec8-8b43-11e5-9567-3c15c2d4ab3e'
	, '06cfc952-8b41-11e5-9563-3c15c2d4ab3e', 3, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_r_role_menu (menu_id, role_id, privilege, create_by) values ('98b051e0-8b44-11e5-9569-3c15c2d4ab3e'
	, '06cfc952-8b41-11e5-9563-3c15c2d4ab3e', 3, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');
insert into s_r_role_menu (menu_id, role_id, privilege, create_by) values ('93ef6ce6-8b43-11e5-9568-3c15c2d4ab3e'
	, '06cfc952-8b41-11e5-9563-3c15c2d4ab3e', 3, 'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e');

-- 系统用户表
drop table if exists s_t_user;
create table s_t_user (
	id uuid default uuid_generate_v1(),
	name varchar(20) not null,
	real_name varchar(100) default '',
	password varchar(32) not null,
	complex_value varchar(16) not null,
	code varchar(10) default '',
	role_id uuid not null, -- ?
	phone varchar(20) default '',
	mobile varchar(20) default '',
	email  varchar(100) default '',
	address varchar(200) default '',
	remark varchar(100) default '',
	
	status smallint not null default '1',
	create_time timestamp default now(),
	create_by uuid not null,
	update_time timestamp default null,
	update_by uuid default null,
	primary key(id)
);
comment on column s_t_user.name is '登陆名';
comment on column s_t_user.real_name is '真实姓名';
comment on column s_t_user.complex_value is '复杂密码用字符串，避免用户设置密码过于简单';
comment on column s_t_user.code is '工号';
comment on column s_t_user.role_id is '角色id';
comment on column s_t_user.phone is '电话';
comment on column s_t_user.mobile is '手机';
comment on column s_t_user.email is 'email';
comment on column s_t_user.address is '地址';
comment on column s_t_user.status is '状态：0停用 1正常';

insert into s_t_user (id, name, real_name, code, role_id, password, complex_value, create_by, remark)
	values ('dfb40e80-8b42-11e5-9564-3c15c2d4ab3e', 'admin', '超级用户', 'CJ999999',
	'06cfc952-8b41-11e5-9563-3c15c2d4ab3e', '9d54514aeb28f168812f770a7fcf4736', 'NodeFramework',
	'dfb40e80-8b42-11e5-9564-3c15c2d4ab3e', '初始用户');



