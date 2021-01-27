## mysql练习题

数据：

```sql
--建表
--学生表
CREATE TABLE `Student`(
`s_id` VARCHAR(20),
`s_name` VARCHAR(20) NOT NULL DEFAULT '',
`s_birth` VARCHAR(20) NOT NULL DEFAULT '',
`s_sex` VARCHAR(10) NOT NULL DEFAULT '',
PRIMARY KEY(`s_id`)
);
--课程表
CREATE TABLE `Course`(
`c_id` VARCHAR(20),
`c_name` VARCHAR(20) NOT NULL DEFAULT '',
`t_id` VARCHAR(20) NOT NULL,
PRIMARY KEY(`c_id`)
);
--教师表
CREATE TABLE `Teacher`(
`t_id` VARCHAR(20),
`t_name` VARCHAR(20) NOT NULL DEFAULT '',
PRIMARY KEY(`t_id`)
);
--成绩表
CREATE TABLE `Score`(
`s_id` VARCHAR(20),
`c_id` VARCHAR(20),
`s_score` INT(3),
PRIMARY KEY(`s_id`,`c_id`)
);
--插入学生表测试数据
insert into Student values('01' , '赵雷' , '1990-01-01' , '男');
insert into Student values('02' , '钱电' , '1990-12-21' , '男');
insert into Student values('03' , '孙风' , '1990-05-20' , '男');
insert into Student values('04' , '李云' , '1990-08-06' , '男');
insert into Student values('05' , '周梅' , '1991-12-01' , '女');
insert into Student values('06' , '吴兰' , '1992-03-01' , '女');
insert into Student values('07' , '郑竹' , '1989-07-01' , '女');
insert into Student values('08' , '王菊' , '1990-01-20' , '女');
--课程表测试数据
insert into Course values('01' , '语文' , '02');
insert into Course values('02' , '数学' , '01');
insert into Course values('03' , '英语' , '03');

--教师表测试数据
insert into Teacher values('01' , '张三');
insert into Teacher values('02' , '李四');
insert into Teacher values('03' , '王五');

--成绩表测试数据
insert into Score values('01' , '01' , 80);
insert into Score values('01' , '02' , 90);
insert into Score values('01' , '03' , 99);
insert into Score values('02' , '01' , 70);
insert into Score values('02' , '02' , 60);
insert into Score values('02' , '03' , 80);
insert into Score values('03' , '01' , 80);
insert into Score values('03' , '02' , 80);
insert into Score values('03' , '03' , 80);
insert into Score values('04' , '01' , 50);
insert into Score values('04' , '02' , 30);
insert into Score values('04' , '03' , 20);
insert into Score values('05' , '01' , 76);
insert into Score values('05' , '02' , 87);
insert into Score values('06' , '01' , 31);
insert into Score values('06' , '03' , 34);
insert into Score values('07' , '02' , 89);
insert into Score values('07' , '03' , 98);
```



```sql
mysql> select * from course;
+------+--------+------+
| c_id | c_name | t_id |
+------+--------+------+
| 01   | 语文   | 02   |
| 02   | 数学   | 01   |
| 03   | 英语   | 03   |
+------+--------+------+
mysql> select * from student;                                         
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |    
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
| 05   | 周梅   | 1991-12-01 | 女    |
| 06   | 吴兰   | 1992-03-01 | 女    |
| 07   | 郑竹   | 1989-07-01 | 女    |
| 08   | 王菊   | 1990-01-20 | 女    |
+------+--------+------------+-------+
mysql> select * from score;        mysql> select * from teacher;
+------+------+---------+			+------+--------+
| s_id | c_id | s_score |			| t_id | t_name |
+------+------+---------+			+------+--------+
| 01   | 01   |      80 |			| 01   | 张三   |
| 01   | 02   |      90 |			| 02   | 李四   |
| 01   | 03   |      99 |			| 03   | 王五   |
| 02   | 01   |      70 |			+------+--------+
| 02   | 02   |      60 |
| 02   | 03   |      80 |
| 03   | 01   |      80 |
| 03   | 02   |      80 |
| 03   | 03   |      80 |
| 04   | 01   |      50 |
| 04   | 02   |      30 |
| 04   | 03   |      20 |
| 05   | 01   |      76 |
| 05   | 02   |      87 |
| 06   | 01   |      31 |
| 06   | 03   |      34 |
| 07   | 02   |      89 |
| 07   | 03   |      98 |
+------+------+---------+
```

题目：

```sql
-- 1、查询"01"课程比"02"课程成绩高的学生的信息及课程分数
select st.*,s1.s_score,s2.s_score from student st
left join score s1 on s1.s_id=st.s_id and s1.c_id='01'
left join score s2 on s2.s_id=st.s_id and s2.c_id='02'
where s1.s_score>s2.s_score;

+------+--------+------------+-------+---------+---------+
| s_id | s_name | s_birth    | s_sex | s_score | s_score |
+------+--------+------------+-------+---------+---------+
| 02   | 钱电   | 1990-12-21 | 男    |      70 |      60 |
| 04   | 李云   | 1990-08-06 | 男    |      50 |      30 |
+------+--------+------------+-------+---------+---------+

-- 2、查询"01"课程比"02"课程成绩低的学生的信息及课程分数

select st.*,s2.s_score from student st
left join score s1 on s1.s_id=st.s_id and s1.c_id='01'
left join score s2 on s2.s_id=st.s_id and s2.c_id='02'
where s1.s_score<s2.s_score;

+------+--------+------------+-------+---------+
| s_id | s_name | s_birth    | s_sex | s_score |
+------+--------+------------+-------+---------+
| 01   | 赵雷   | 1990-01-01 | 男    |      90 |
| 05   | 周梅   | 1991-12-01 | 女    |      87 |
+------+--------+------------+-------+---------+

-- 3、查询平均成绩大于等于60分的同学的学生编号和学生姓名和平均成绩
select st.s_id,st.s_name,round(avg(s1.s_score),2) avgScore from student st
left join  score s1 on s1.s_id=st.s_id 
group by st.s_id having avgScore>=60;


-- 4、查询平均成绩小于60分的同学的学生编号和学生姓名和平均成绩
 -- (包括有成绩的和无成绩的)
select st.s_id,st.s_name,(case when avg(sc.s_score) is null then 0 else avg(sc.s_score) end) avgScore  from student st
left join score sc on st.s_id=sc.s_id
group by st.s_id having avgScore <60 or avgScore=0;

+------+--------+----------+
| s_id | s_name | avgScore |
+------+--------+----------+
| 04   | 李云   |  33.3333 |
| 06   | 吴兰   |  32.5000 |
| 08   | 王菊   |        0 |
+------+--------+----------+

-- 5、查询所有同学的学生编号、学生姓名、选课总数、所有课程的总成绩
select st.s_id,st.s_name,count(distinct(sc.c_id)) classNum ,
(case when sum(sc.s_score) is null then 0 else sum(sc.s_score) end) totalScore from student st 
left join score sc on st.s_id=sc.s_id 
group by st.s_id;
+------+--------+----------+------------+
| s_id | s_name | classNum | totalScore |
+------+--------+----------+------------+
| 01   | 赵雷   |        3 |        269 |
| 02   | 钱电   |        3 |        210 |
| 03   | 孙风   |        3 |        240 |
| 04   | 李云   |        3 |        100 |
| 05   | 周梅   |        2 |        163 |
| 06   | 吴兰   |        2 |         65 |
| 07   | 郑竹   |        2 |        187 |
| 08   | 王菊   |        0 |          0 |
+------+--------+----------+------------+

-- 6、查询"李"姓老师的数量 
select count(*) from teacher t where t.t_name like '李%';  --不是很准确，老师的数量应该以不同的id为标准
--第二种写法:
select t.t_name,count(t.t_id) from teacher t group by t.t_id having t.t_name like '李%';
+--------+---------------+
| t_name | count(t.t_id) |
+--------+---------------+
| 李四   |             1 |
+--------+---------------+

-- 7、查询学过"张三"老师授课的同学的信息 
select st.* from student st 
left join score sc on st.s_id=sc.s_id
left join course co on sc.c_id=co.c_id 
left join teacher t on co.t_id=t.t_id
where t.t_name="张三";
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
| 05   | 周梅   | 1991-12-01 | 女    |
| 07   | 郑竹   | 1989-07-01 | 女    |
+------+--------+------------+-------+

-- 8、查询没学过"张三"老师授课的同学的信息 

 
 -- 9、查询学过编号为"01"并且也学过编号为"02"的课程的同学的信息
select st.* from student st
inner join score sc on sc.s_id=st.s_id
inner join course co on co.c_id=sc.c_id and co.c_id="01"
where st.s_id in (
	select st.s_id from student st
	inner join score sc on sc.s_id=st.s_id
	inner join course co on co.c_id=sc.c_id and co.c_id="02"
);
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
| 05   | 周梅   | 1991-12-01 | 女    |
+------+--------+------------+-------+
--第二种方法：
select * from 
	student a,score b,score c
where
	a.s_id=b.s_id
	and a.s_id=c.s_id
	and c.c_id='01'
	and b.c_id='02';
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
| 05   | 周梅   | 1991-12-01 | 女    |
+------+--------+------------+-------+


-- 10、查询学过编号为"01"但是没有学过编号为"02"的课程的同学的信息
select st.* from student st
inner join score sc on sc.s_id=st.s_id and sc.c_id='01'
where st.s_id not in
(
	select st.s_id from student st
	inner join score sc on sc.s_id=st.s_id and sc.c_id='02'
);
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 06   | 吴兰   | 1992-03-01 | 女    |
+------+--------+------------+-------+

-- 11、查询没有学全所有课程的同学的信息
select st.* from student st 
inner join score sc on sc.s_id=st.s_id
inner join course co on co.c_id=sc.c_id
group by st.s_id having count(co.c_id)<3;
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 05   | 周梅   | 1991-12-01 | 女    |
| 06   | 吴兰   | 1992-03-01 | 女    |
| 07   | 郑竹   | 1989-07-01 | 女    |
+------+--------+------------+-------+


-- 12、查询至少有一门课与学号为"01"的同学所学相同的同学的信息
select distinct st.* from student st
inner join score sc on sc.s_id=st.s_id
where sc.c_id in(
select sc.c_id from student st
left join score sc on sc.s_id=st.s_id
where sc.s_id='01'
);

+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
| 05   | 周梅   | 1991-12-01 | 女    |
| 06   | 吴兰   | 1992-03-01 | 女    |
| 07   | 郑竹   | 1989-07-01 | 女    |
+------+--------+------------+-------+

-- 13、查询和"01"号的同学学习的课程完全相同的其他同学的信息
select st.* from student st
inner join score sc on sc.s_id=st.s_id
group by st.s_id having group_concat(sc.c_id)=
(
	select group_concat(sc.c_id) from student st 
	inner join score sc on sc.s_id=st.s_id
	where st.s_id='01'
);
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 01   | 赵雷   | 1990-01-01 | 男    |
| 02   | 钱电   | 1990-12-21 | 男    |
| 03   | 孙风   | 1990-05-20 | 男    |
| 04   | 李云   | 1990-08-06 | 男    |
+------+--------+------------+-------+

-- 14、查询没学过"张三"老师讲授的任一门课程的学生姓名
select st.s_name from student st
where st.s_id not in(
	select sc.s_id from score sc 
	inner join course co on co.c_id=sc.c_id
	inner join teacher t on t.t_id=co.t_id and t.t_name='张三'
);
+--------+
| s_name |
+--------+
| 吴兰   |
| 王菊   |
+--------+

-- 15、查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩
select st.s_id,st.s_name,avg(sc.s_score) avgScore from student st 
inner join score sc on sc.s_id =st.s_id
where sc.s_score <60 
group by st.s_id having count(1)>=2;
+------+--------+----------+
| s_id | s_name | avgScore |
+------+--------+----------+
| 04   | 李云   |  33.3333 |
| 06   | 吴兰   |  32.5000 |
+------+--------+----------+

-- 16、检索"01"课程分数小于60，按分数降序排列的学生信息
select st.* from student st
inner join score sc on sc.s_id=st.s_id and sc.s_score <60 and sc.c_id='01' order by sc.s_score desc;
+------+--------+------------+-------+
| s_id | s_name | s_birth    | s_sex |
+------+--------+------------+-------+
| 04   | 李云   | 1990-08-06 | 男    |
| 06   | 吴兰   | 1992-03-01 | 女    |
+------+--------+------------+-------+

-- 17、按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩
select st.*,sc2.s_score,sc3.s_score,sc4.s_score,avg(sc.s_score) avgScore from student st 
inner join score sc on sc.s_id=st.s_id 
left join score sc2 on sc2.s_id=st.s_id and sc2.c_id='01'
left join score sc3 on sc3.s_id=st.s_id and sc3.c_id='02'
left join score sc4 on sc4.s_id=st.s_id and sc4.c_id='03'
group by st.s_id order by avgScore;
+------+--------+------------+-------+---------+---------+---------+----------+
| s_id | s_name | s_birth    | s_sex | s_score | s_score | s_score | avgScore |
+------+--------+------------+-------+---------+---------+---------+----------+
| 06   | 吴兰   | 1992-03-01 | 女    |      31 |    NULL |      34 |  32.5000 |
| 04   | 李云   | 1990-08-06 | 男    |      50 |      30 |      20 |  33.3333 |
| 02   | 钱电   | 1990-12-21 | 男    |      70 |      60 |      80 |  70.0000 |
| 03   | 孙风   | 1990-05-20 | 男    |      80 |      80 |      80 |  80.0000 |
| 05   | 周梅   | 1991-12-01 | 女    |      76 |      87 |    NULL |  81.5000 |
| 01   | 赵雷   | 1990-01-01 | 男    |      80 |      90 |      99 |  89.6667 |
| 07   | 郑竹   | 1989-07-01 | 女    |    NULL |      89 |      98 |  93.5000 |
+------+--------+------------+-------+---------+---------+---------+----------+

-- 18.查询各科成绩最高分、最低分和平均分：
--以如下形式显示：课程ID，课程name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率
-- 及格为>=60，中等为：70-80，优良为：80-90，优秀为：>=90
select sc.c_id,co.c_name,max(sc.s_score) '最高分',MIN(sc.s_score) '最低分',avg(sc.s_score) '平均分' ,
sum(case when sc.s_score >=60 then 1 else 0 end)/count(*) '及格率',
sum(case when sc.s_score >=70 and sc.s_score<80 then 1 else 0 end)/count(*) '中等率',
sum(case when sc.s_score >=80 and sc.s_score<90 then 1 else 0 end)/count(*) '优良率',
sum(case when sc.s_score >=90 then 1 else 0 end)/count(*) '优秀率'
from score sc
inner join course co on co.c_id=sc.c_id
group by sc.c_id;
+------+--------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
| c_id | c_name | 最高分    | 最低分    | 平均分    | 及格率    | 中等率    | 优良率    | 优秀率    |
+------+--------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
| 01   | 语文   |        80 |        31 |   64.5000 |    0.6667 |    0.3333 |    0.3333 |    0.0000 |
| 02   | 数学   |        90 |        30 |   72.6667 |    0.8333 |    0.0000 |    0.5000 |    0.1667 |
| 03   | 英语   |        99 |        20 |   68.5000 |    0.6667 |    0.0000 |    0.3333 |    0.3333 |
+------+--------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+

-- 19、按各科成绩进行排序，并显示排名
select sc.s_id,co.c_id,co.c_name,@score:=sc.s_score,@i:=@i+1 as i保留排名  from course co
left join score sc on sc.c_id=co.c_id,(select @i:=0) i
where sc.c_id='01' order by sc.s_score;
+------+------+--------+--------------------+---------------+
| s_id | c_id | c_name | @score:=sc.s_score | i保留排名     |
+------+------+--------+--------------------+---------------+
| 06   | 01   | 语文   |                 31 |             1 |
| 04   | 01   | 语文   |                 50 |             2 |
| 02   | 01   | 语文   |                 70 |             3 |
| 05   | 01   | 语文   |                 76 |             4 |
| 01   | 01   | 语文   |                 80 |             5 |
| 03   | 01   | 语文   |                 80 |             6 |
+------+------+--------+--------------------+---------------+













```



## Windows 上安装 MySQL

#### 下载安装包

![image-20200220032424812](mysql.assets/image-20200220032424812.png)

点击 **Download** 按钮进入下载页面，点击下图中的 **No thanks, just start my download.** 就可立即下载：

![img](mysql.assets/330405-20160709174941374-1821908969.png)

下载完后，我们将 `zip` 包解压到相应的目录，这里我将解压后的文件夹放在 D盘一级目录下。

#### 配置MySQL 的文件

打开刚刚解压的文件夹 **D:\mysql-8.0.19-winx64** ，在该文件夹下创建 **my.ini** 配置文件，编辑 **my.ini** 配置以下基本信息：

```sql
[client]
## 设置mysql客户端默认字符集
default-character-set=utf8
 
[mysqld]
## 设置3306端口
port = 3306
## 设置mysql的安装目录
basedir=D:\mysql-8.0.19-winx64
## 设置 mysql数据库的数据的存放目录，MySQL 8+ 不需要以下配置，系统自己生成即可，否则有可能报错
## datadir=D:\\mysql-8.0.19-winx64\\sqldata
## 允许最大连接数
max_connections=20
## 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
## 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
```

#### 配置mysql环境变量

![image-20200220034144352](mysql.assets/image-20200220034144352.png)

#### 启动 MySQL 数据库

以管理员身份打开 `cmd` 命令行工具，切换目录：

```shell
cd D:
cd mysql-8.0.18-winx64\bin
```

初始化数据库：

```shell
.\mysqld --initialize --console
```

执行完成后，会输出 `root` 用户的初始默认密码，如：

```sql
...
2018-04-20T02:35:05.464644Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: fG;ow2=bAaEk
...
```

**fG;ow2=bAaEk** 就是初始密码，后续登录需要用到，你也可以在登陆后修改密码。

输入以下安装命令：

```shell
.\mysqld install
```

启动输入以下命令即可：

```sql
net start mysql
```

> 注意: 在 5.7 需要初始化 data 目录：
>
> ```sql
> cd C:\web\mysql-8.0.11\bin 
> mysqld --initialize-insecure 
> ```
>
> 初始化后再运行 `net start mysql` 即可启动 `mysql`。

------

#### 登录 MySQL

当 `MySQL` 服务已经运行时, 我们可以通过 `MySQL` 自带的客户端工具登录到 `MySQL` 数据库中, 首先打开命令提示符, 输入以下格式的命名:

```
mysql -h 主机名 -u 用户名 -p
```

参数说明：

- **-h** : 指定客户端所要登录的 `MySQL` 主机名, 登录本机(`localhost` 或 `127.0.0.1`)该参数可以省略;
- **-u** : 登录的用户名;
- **-p** : 告诉服务器将会使用一个密码来登录, 如果所要登录的用户名密码为空, 可以忽略此选项。

如果我们要登录本机的 MySQL 数据库，只需要输入以下命令即可：

```
mysql -u root -p
```

按回车确认, 如果安装正确且 MySQL 正在运行, 会得到以下响应:

```
Enter password:
```

若密码存在, 输入密码登录, 不存在则直接按回车登录。登录成功后你将会看到 `Welcome to the MySQL monitor...` 的提示语。

然后命令提示符会一直以 **mysq>** 加一个闪烁的光标等待命令的输入, 输入 **exit** 或 **quit** 退出登录。

#### 更改密码

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'krystal';
```

#### 安装视频

<video src='E:\LearningAll\8-HadoopEcosystem-Video\md视频\Lesson1-mysql安装.mp4' style='border: 3px solid black'/>
## mysql介绍

#### :one:Sql概述

`SQL`，结构化查询语言，是一种用来操作`RDBMS`的数据库语言，当前关系型数据库都⽀持使⽤`SQL`语⾔进⾏操作,也就是说可以通过`SQL`操作`oracle,sql server,mysql,sqlite`等等所 有的关系型的数据库。

`SQL`的全称`Structured Query Language`，`SQL`用来和数据库打交道，完成和数据库的通信，`SQL`是一套标准。但是每一个数据库都有自己的特性，别的数据库没有,当使用这个数据库特性相关的功能,这时`SQL`语句可能就不是标准了。(绝大多数情况下`SQL`都是通用的)

![image-20200220045521258](mysql.assets/image-20200220045521258.png)

#### :two:数据库概述

数据库，通常是一个或一组文件，保存了一些符合特定规格的数据,数据库对应的英语单词是`DataBase`,简称:`DB`。

数据库**软件**称为数据库管理系统（`DBMS`），全称为`DataBase Management System`，如：`Oracle、SQL Server、MySql、Sybase、informix、DB2、interbase、PostgreSql` 。

主要有两种类型的数据库：关系型数据库、⾮关系型数据库 

查看数据库排名:https://db-engines.com/en/ranking 

关系型数据库的主要产品：

- `oracle`：在以前的⼤型项⽬中使⽤,银⾏,电信等项⽬ 
- `mysql`：web时代使⽤最⼴泛的关系型数据库 
- `ms	sql	server`：在微软的项⽬中使⽤ 
- `sqlite`：轻量级数据库，主要应⽤在移动平台（比如手机上）。

#### :three:MySql概述 

`MySQL`最初是由“`MySQL AB`”公司开发的一套关系型数据库管理系统（`RDBMS` -`Relational Database Mangerment System`）。

`MySQL`不仅是最流行的开源数据库，而且是业界成长最快的数据库，每天有超过7万次的下载量，其应用范围从大型企业到专有的嵌入应用系统。

`MySQL AB`是由两个瑞典人和一个芬兰人：`David Axmark、Allan Larsson`和`Michael “Monty” Widenius`在瑞典创办的。

在2008年初，`Sun Microsystems`收购了`MySQL AB`公司。在2009年，`Oracle`收购了`Sun`公司，使`MySQL`并入`Oracle`的数据库产品线。 

#### :four:RDBMS和数据库的关系

![image-20200220044548289](mysql.assets/image-20200220044548289.png)



## sql语句分类

`SQL`语句主要分为：

`DQL`：数据查询语⾔，⽤于对数据进⾏查询，如`select` 

`DML`：数据操作语⾔，对数据进⾏增加、修改、删除，如`insert`、`udpate`、`delete` 

`TPL`：事务处理语⾔，对事务进⾏处理，包括`begin`	`transaction`、`commit`、 `rollback` 

`DCL`：数据控制语⾔，进⾏授权与权限回收，如`grant`、`revoke` 

`DDL`：数据定义语⾔，进⾏数据库、表的管理等，如`create`、`drop` 

`CCL`：指针控制语⾔，通过控制指针完成表的操作，如`declare	cursor` 

对于web程序员来讲，重点是数据的`crud`（增删改查），必须熟练编写`DQL、DML`， 能够编写`DDL`完成数据库、表的操作，其它语⾔如`TPL、DCL、CCL`了解即可 。

`sql`语句不区分大小写。

## 常用sql语句操作数据库

##### 连接mysql

```shell
mysql -u root -p
```

##### 退出mysql

```sql
exit
quit
```

##### 修改提示符

`\U`表示当前用户

```sql
mysql>prompt \U mysql>
PROMPT set to '\U mysql>'
root@localhost mysql>
```

##### 创建数据库

语法：`create database` 数据库名称;

```sql
create database db1;
create database db1 charset=utf8; #指定字符集编码格式
```

##### 选择数据库

语法：`use` 数据库名称

```sql
use db1;
```

在数据库中建立表，因此创建表的时候必须要先选择数据库。

##### 查看存在的数据库

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| db1                |
| information_schema |
| mysql              |  #mysql是属于系统的数据库
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

##### 查询当前使用的数据库

```sql
select database();
```

##### 查询数据库版本

```sql
select  version();
```

##### 删除数据库

```sql
drop database db1;
```

## 导入sql脚本

导入`sql`脚本，获得演示数据，辅助学习。

```sql
source F:\bjpowernode.sql
```

导入的脚本内容如下，实际上就是通过在`txt`上编写`sql`语句，然后保存为`.sql`格式。

```sql
drop table if exists dept;
drop table if exists salgrade;
drop table if exists emp;
 
create table dept(
		deptno int(10) primary key,
		dname varchar(14),
		loc varchar(13)
		);
		
create table salgrade(
		grade int(11),
		losal int(11),
		hisal int(11)
		);
		
create table emp(
		empno int(4) primary key,
		ename varchar(10),
		job varchar(9),
		mgr int(4),
		hiredate date,
		sal double(7,2),
		comm double(7,2),
		deptno int(2)
		);
		
insert into dept(deptno,dname,loc) values(10,'ACCOUNTING','NEW YORK');
insert into dept(deptno,dname,loc) values(20,'RESEARCHING','DALLAS');
insert into dept(deptno,dname,loc) values(30,'SALES','CHICAGO');
insert into dept(deptno,dname,loc) values(40,'OPERATIONS','BOSTON');
 
insert into salgrade(grade,losal,hisal) values(1,700,1200);
insert into salgrade(grade,losal,hisal) values(2,1201,1400);
insert into salgrade(grade,losal,hisal) values(3,1401,2000);
insert into salgrade(grade,losal,hisal) values(4,2001,3000);
insert into salgrade(grade,losal,hisal) values(5,3001,5000);
 
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7369,'SIMITH','CLERK',7902,'1980-12-17',800,null,20);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7499,'ALLEN','SALESMAN',7698,'1981-02-20',1600,300,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7521,'WARD','SALESMAN',7698,'1981-02-22',1250,500,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7566,'JONES','MANAGER',7839,'1981-04-02',2975,null,20);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7654,'MARTIN','SALESMAN',7698,'1981-09-28',1250,1400,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7698,'BLAKE','MANAGER',7839,'1981-05-01',2850,null,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7782,'CLARK','MANAGER',7839,'1981-06-09',2450,null,10);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7788,'SCOTT','ANALYST',7566,'1987-04-19',3000,null,20);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7839,'KING','PRESIDENT',null,'1981-11-17',5000,null,10);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7844,'TURNER','SALESMAN',7698,'1981-09-08',1500,null,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7876,'ADAMS','CLERK',7788,'1987-05-23',1100,null,20);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7900,'JAMES','CLERK',7698,'1981-12-03',950,null,30);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7902,'FORD','ANALYST',7566,'1981-12-03',3000,null,20);
insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno)
	values(7934,'MILLER','CLERK',7782,'1982-01-23',1300,null,10);
	
select * from dept;
select * from salgrade;
select * from emp;
```



## 表概述

表(`table`)是一种**结构化的文件**，可以用来存储特定类型的数据，如：学生信息，课程信息，都可以放到表中。

表都有特定的名称，而且不能重复。表中具有几个概念：

- 列叫做字段(`Column`), 每一个字段都有:名称、数据类型、约束、长度
- 行叫做表中的记录
- 主键

**学生信息表**

| 学号（主键） | 姓名 | 性别 | 年龄 |
| ------------ | ---- | ---- | ---- |
| 00001        | 张三 | 男   | 20   |
| 00002        | 李四 | 女   | 20   |

![image-20200220053630323](mysql.assets/image-20200220053630323.png)



## 数据类型 

可以通过查看帮助⽂档查阅所有⽀持的数据类型 

使⽤数据类型的原则是：**够⽤就⾏，尽量使⽤取值范围⼩的，⽽不⽤⼤的，这样 可以更多的节省存储空间**。

常⽤数据类型如下： 

- 整数：`int`，`bit` 
- ⼩数：`decimal` 
- 字符串：`varchar,char` varchar使用时一定要指定最大长度，如varchar(12)
- ⽇期时间:	`date,	time,	datetime` 
- 枚举类型：`enum`
- 非负数`unsigned`: 没有负数（与数据类型结合使用，如`int unsigned`，不能单独使用）。

特别说明的类型如下： 

- `decimal`表⽰浮点数，如`decimal(5,2)`表⽰共存`5`位数，⼩数占`2`位 
- `char`表⽰固定长度的字符串，如`char(3)`，如果填充`'ab'`时会补⼀个空格为`'ab	'`	
- `varchar`表⽰可变长度的字符串，如`varchar(3)`，填充`'ab'`时就会存储`a`b
- `text` 表⽰存储⼤⽂本，当字符⼤于`4000`时推荐使⽤ 
- 对于图⽚、⾳频、视频等⽂件，不存储在数据库中，⽽是上传到某个服务器 上，然后在表中存储这个⽂件的保存路径 

更全的数据类型可以参考http://blog.csdn.net/anxpp/article/details/51284106 

![image-20200220060246638](mysql.assets/image-20200220060246638.png)

![image-20200220060320241](mysql.assets/image-20200220060320241.png)

## 约束 

主键`primary	key`：物理上存储的顺序。------》不支持`varchar`数据类型

⾮空`not	null`：此字段不允许填写空值 

惟⼀`unique`：此字段的值不允许重复 

默认`default`：字段的默认值，当不填写此值时会使⽤默认值，如果填写时以填写为准 

自动增长：`auto_increment`

外键`foreign	key`：对关系字段进⾏约束，当为关系字段填写值时，会到关联的表中查询此值是否存在，如果存在则填写成功，如果不存在则填写失败并抛出异常。

说明：虽然外键约束可以保证数据的有效性，但是在进⾏数据的`crud`（增加、修改、 删除、查询）时，都会降低数据库的性能，所以不推荐使⽤，那么数据的有效性怎 么保证呢？

答：**可以在逻辑层进⾏控制**

主键和唯一约束都要求字段值唯一，除此外，它们还有如下区别：

- 同一张表只能有一个主键，但能有多个唯一约束；
- 主键字段值不能为NULL，唯一约束字段值可以为NULL；
- 主键字段可以做为其他表的外键，唯一约束字段不可以做为其他表的外键；



## 常用sql语句操作表

##### 创建表语法：

```sql
#语法:create tabel t_student(字段名 字段类型 字段约束);
```

##### 案例1：创建表

如果表已经存在的时候，创建同名表会报错。

```sql
create table t_students(
	id int unsigned primary key auto_increment, #非负自动递增整数类型的主键
    name varchar(15) not null, ## 最大长度为15的非空的字符串类型
    age tinyint unsigned default 0, #默认值为0
    high decimal(5,2) default 0.0,
    gender enum('男','女','中性','保密') default '保密', ## 枚举类型字段
    cls_id int unsigned not null 
);
#最后一个字段末尾不要加逗号
#创建表至少有一个字段
#直接将上列代码复制粘贴到cmd窗口运行就行
```

##### 查看表结构

```sql
mysql>desc t_students;
+--------+-------------------------------------+------+-----+---------+----------------+
| Field  | Type                                | Null | Key | Default | Extra          |
+--------+-------------------------------------+------+-----+---------+----------------+
| id     | int(10) unsigned                    | NO   | PRI | NULL    | auto_increment |
| name   | varchar(15)                         | NO   |     | NULL    |                |
| age    | tinyint(3) unsigned                 | YES  |     | 0       |                |
| high   | decimal(5,2)                        | YES  |     | 0.00    |                |
| gender | enum('男','女','中性','保密')       | YES  |     | 保密    |                |
| cls_id | int(10) unsigned                    | NO   |     | NULL    |                |
+--------+-------------------------------------+------+-----+---------+----------------+
6 rows in set (0.00 sec)
```

##### 查看表的创建语句

```sql
show create table t_students;
```

##### 修改表的结构

```sql
#添加字段 alter+add
alter table t_students add birthday datetime default "2000-1-1 10:10:10";
#修改字段的数据类型和默认值 alter+modify
alter table t_students modify birthday date default "2000-1-1";
#重命名字段和更改数据类型 alter+change
alter table t_students change birthday birth date default "2000-1-1";
#删除表的字段 alter+drop
alter table t_students drop gender;


mysql>desc t_students;
+--------+-----------------------------+------+-----+------------+----------------+
| Field  | Type                        | Null | Key | Default    | Extra          |
+--------+-----------------------------+------+-----+------------+----------------+
| id     | int(10) unsigned            | NO   | PRI | NULL       |auto_increment  |
| name   | varchar(15)                 | NO   |     | NULL       |                |
| age    | tinyint(3) unsigned         | YES  |     | 0          |                |
| high   | decimal(5,2)                | YES  |     | 0.00       |                |
| cls_id | int(10) unsigned            | NO   |     | NULL       |                |
| birth  | date                        | YES  |     | 2000-01-01 |                |
+--------+---------------------------+------+-----+------------+------------------+
7 rows in set (0.00 sec)
```



##### 查看当前使用的数据库中存在的表

```sql
mysql>show tables;
+---------------+
| Tables_in_db1 |
+---------------+
| t_student     |
| t_students    |
+---------------+
2 rows in set (0.00 sec)
```

##### 查看其它数据库中存在的表

```sql
mysql>show tables from db2;
+---------------+
| Tables_in_db2 |
+---------------+
| familyinfo    |
+---------------+
1 row in set (0.00 sec)
```

## 常用sql语句--数据的增删改查

##### 增加数据语法

```sql
insert 表名 values(值1,值2....);  #给所有的列（字段）添加数据
insert into 表名 (列1,列2...) values(值1,值2....);  #给指定列（字段）添加数据
insert into 表名 (列1,...) values(值1,...),(...)  #多行插入，批量插入
```

##### 案例1：增加数据

```sql
create table familyInfo(
	id int unsigned primary key auto_increment, 
	motherName varchar(15) not null default 'mother',
	fatherName varchar(15) not null default 'father',
    kidName varchar(15) not null default 'kid' #这里一定不要有逗号
);

mysql>desc familyInfo;
+------------+------------------+------+-----+---------+----------------+
| Field      | Type             | Null | Key | Default | Extra          |
+------------+------------------+------+-----+---------+----------------+
| id         | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| motherName | varchar(15)      | NO   |     | mother  |                |
| fatherName | varchar(15)      | NO   |     | father  |                |
| kidName    | varchar(15)      | NO   |     | kid     |                |
+------------+------------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)


#================给所有的列（字段）添加数据===============
insert familyInfo values(0,'Michelle','Jordan','kid1'); #值和表的字段顺序必须一一对应
insert familyInfo values(0,'krystal','jimmy','kid2'); 
insert familyInfo values(default,'velyn','dan','kid3'); 
insert familyInfo values(null,'Jsom','virginia','kid4');
#==================给指定列（字段）添加数据=================
insert into familyInfo (motherName) values('rose');
#==================多行插入，批量插入======================
insert into familyInfo (fatherName,kidName) values('Johnson','eric'),('Mike','susan');

```

补充：

- 除了主键，其它字段如果没有`default`默认值，那么添加数据的时候一定要为该字段添加数据。如果某字段有`default`默认值，就可以不亲自给它加数据，使用默认值即可。
- `unsigned`必须跟在数据类型的后面，如`int unsigned`。
- 主键有占位符的概念，`0、default、null`都可以作为它的占位符，只是占个位置，实际的值有递增等结果决定。使用**insert 表 values(...)**方式添加数据的时候，记得带上占位符。

##### 查询表数据内容

```sql
mysql>select * from familyInfo;
+----+------------+------------+---------+
| id | motherName | fatherName | kidName |
+----+------------+------------+---------+
|  1 | Michelle   | Jordan     | kid1    |
|  2 | krystal    | jimmy      | kid2    |
|  3 | velyn      | dan        | kid3    |
|  4 | Jsom       | virginia   | kid4    |
|  5 | rose       | father     | kid     |
|  6 | mother     | Johnson    | eric    |
|  7 | mother     | Mike       | susan   |
+----+------------+------------+---------+
7 rows in set (0.00 sec)
```

##### 更改数据

```sql
create table t_update(
	id int unsigned not null primary key auto_increment,
    name varchar(13) not null default 'jimmy'
);
insert into t_update values();
insert into t_update values(0,"krystal");

mysql> select * from t_update;
+----+---------+
| id | name    |
+----+---------+
|  1 | krystal |
|  2 | jimmy   |
+----+---------+
2 rows in set (0.00 sec)

#================第一种更改===========================
update t_update set name='who';
mysql> select * from t_update;
+----+------+
| id | name |
+----+------+
|  1 | who  |
|  2 | who  |
+----+------+
2 rows in set (0.00 sec)
#================第二种更改===========================
update t_update set name='James' where id =2;
mysql> select * from t_update;
+----+-------+
| id | name  |
+----+-------+
|  1 | who   |
|  2 | James |
+----+-------+
2 rows in set (0.00 sec)
```

##### 删除数据

**物理删除**，如下，但是逻辑上仍然没有删除，查看存在的表时依然可以查到，而且还可以进行插入数据操作，因此，`delete`物理删除可以理解为删除表的所有内容，但是表的结构还在，表还在。

```sql
## 物理删除表
mysql> delete from t_update;
Query OK, 2 rows affected (0.02 sec)

mysql> select * from t_update;
Empty set (0.00 sec)

mysql> show tables;
+---------------+
| Tables_in_db2 |
+---------------+
| familyinfo    |
| familyinfo2   |
| familyinfo3   |
| t_update      |
| test          |
+---------------+
5 rows in set (0.00 sec)

mysql> insert into t_update (name) values("beta");
Query OK, 1 row affected (0.02 sec)
```

```sql
## 删除表的某些记录
delete from emp where name="jimmy";
```

## sql查询

### sql查询--基本操作

#### 查询一个字段

```sql
mysql> select motherName from familyInfo;
+------------+
| motherName |
+------------+
| Michelle   |
| krystal    |
| velyn      |
| Jsom       |
| rose       |
| mother     |
| mother     |
+------------+
7 rows in set (0.00 sec)
```

#### 查询多个字段

```sql
mysql> select mothername,fathername from familyInfo;
+------------+------------+
| mothername | fathername |
+------------+------------+
| Michelle   | Jordan     |
| krystal    | jimmy      |
| velyn      | dan        |
| Jsom       | virginia   |
| rose       | father     |
| mother     | Johnson    |
| mother     | Mike       |
+------------+------------+
7 rows in set (0.00 sec)
```

#### 查询全部字段

```sql
mysql> select * from familyInfo;
+----+------------+------------+---------+
| id | motherName | fatherName | kidName |
+----+------------+------------+---------+
|  1 | Michelle   | Jordan     | kid1    |
|  2 | krystal    | jimmy      | kid2    |
|  3 | velyn      | dan        | kid3    |
|  4 | Jsom       | virginia   | kid4    |
|  5 | rose       | father     | kid     |
|  6 | mother     | Johnson    | eric    |
|  7 | mother     | Mike       | susan   |
+----+------------+------------+---------+
7 rows in set (0.00 sec)
```

#### 更改查询的字段显示

```sql
mysql> select motherName as "妈妈名字",fathername as "爸爸名字" from familyinfo;
+--------------+--------------+
| 妈妈名字     | 爸爸名字     |
+--------------+--------------+
| Michelle     | Jordan       |
| krystal      | jimmy        |
| velyn        | dan          |
| Jsom         | virginia     |
| rose         | father       |
| mother       | Johnson      |
| mother       | Mike         |
+--------------+--------------+
7 rows in set (0.00 sec)
```

#### 对查询出来的字段进行运算

```sql
create table count_t(
	id int unsigned not null primary key auto_increment,
    salary_month int not null
);
insert into count_t (salary_month) values(3000),(10000),(20000);

mysql> select salary_month*3 from count_t;
+----------------+
| salary_month*3 |
+----------------+
|           9000 |
|          30000 |
|          60000 |
+----------------+
3 rows in set (0.00 sec)
```

### sql查询--条件查询where

#### 条件查询 =

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+

mysql> select sal from emp where job="CLERK";
+---------+
| sal     |
+---------+
|  800.00 |
| 1100.00 |
|  950.00 |
| 1300.00 |
+---------+
4 rows in set (0.00 sec)

mysql> select sal,hiredate from emp where job="CLERK";
+---------+------------+
| sal     | hiredate   |
+---------+------------+
|  800.00 | 1980-12-17 |
| 1100.00 | 1987-05-23 |
|  950.00 | 1981-12-03 |
| 1300.00 | 1982-01-23 |
+---------+------------+
4 rows in set (0.00 sec)
```

#### 条件查询 `<>`

`<>`为不等于号

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job from emp where job<>"clerk";
+--------+-----------+
| ename  | job       |
+--------+-----------+
| ALLEN  | SALESMAN  |
| WARD   | SALESMAN  |
| JONES  | MANAGER   |
| MARTIN | SALESMAN  |
| BLAKE  | MANAGER   |
| CLARK  | MANAGER   |
| SCOTT  | ANALYST   |
| KING   | PRESIDENT |
| TURNER | SALESMAN  |
| FORD   | ANALYST   |
+--------+-----------+
10 rows in set (0.00 sec)
```

#### 条件查询 between...and...

`between … and …`，意思是大于...小于...，它是包含最大值和最小值的。

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job,sal from emp where sal between 1500 and 2000;
+--------+----------+---------+
| ename  | job      | sal     |
+--------+----------+---------+
| ALLEN  | SALESMAN | 1600.00 |
| TURNER | SALESMAN | 1500.00 |
+--------+----------+---------+
2 rows in set (0.00 sec)

```

#### 条件查询 is null

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select * from emp where comm is null;
+-------+--------+-----------+------+------------+---------+------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm | deptno |
+-------+--------+-----------+------+------------+---------+------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 | NULL |     20 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 | NULL |     20 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 | NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 | NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 | NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 | NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 | NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 | NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 | NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 | NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 | NULL |     10 |
+-------+--------+-----------+------+------------+---------+------+--------+
11 rows in set (0.00 sec)
```

#### 条件查询 and

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job,sal from emp where job="clerk" and sal >900;
+--------+-------+---------+
| ename  | job   | sal     |
+--------+-------+---------+
| ADAMS  | CLERK | 1100.00 |
| JAMES  | CLERK |  950.00 |
| MILLER | CLERK | 1300.00 |
+--------+-------+---------+
3 rows in set (0.00 sec)
```

#### 条件查询 or

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job,sal from emp where sal>3000  or sal <900;
+--------+-----------+---------+
| ename  | job       | sal     |
+--------+-----------+---------+
| SIMITH | CLERK     |  800.00 |
| KING   | PRESIDENT | 5000.00 |
+--------+-----------+---------+
2 rows in set (0.00 sec)
```

#### 条件查询 ()

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job,sal,deptno from emp where sal >1800 and (deptno=20 or deptno=30);
+-------+---------+---------+--------+
| ename | job     | sal     | deptno |
+-------+---------+---------+--------+
| JONES | MANAGER | 2975.00 |     20 |
| BLAKE | MANAGER | 2850.00 |     30 |
| SCOTT | ANALYST | 3000.00 |     20 |
| FORD  | ANALYST | 3000.00 |     20 |
+-------+---------+---------+--------+
4 rows in set (0.00 sec)
```

#### 条件查询 in

```
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job from emp where job in ("clerk","manager");
+--------+---------+
| ename  | job     |
+--------+---------+
| SIMITH | CLERK   |
| JONES  | MANAGER |
| BLAKE  | MANAGER |
| CLARK  | MANAGER |
| ADAMS  | CLERK   |
| JAMES  | CLERK   |
| MILLER | CLERK   |
+--------+---------+
7 rows in set (0.00 sec)
```

#### 条件查询 not

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,job from emp where job not in ("clerk","manager");
+--------+-----------+
| ename  | job       |
+--------+-----------+
| ALLEN  | SALESMAN  |
| WARD   | SALESMAN  |
| MARTIN | SALESMAN  |
| SCOTT  | ANALYST   |
| KING   | PRESIDENT |
| TURNER | SALESMAN  |
| FORD   | ANALYST   |
+--------+-----------+
7 rows in set (0.00 sec)
```

#### 条件查询 like

`like`可看成是利用正则表达式来查询字段。符号意思：

- `Like`中`%`和下划线`_`的差别？

- `%`匹配任意字符出现的个数

- `_`下划线只匹配一个字符

- `Like` 中的表达式必须放到单引号中`|`双引号中，以下写法是错误的：

```sql
select  * from emp where ename like _A%  
```

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#查询以A开头的
mysql> select ename,sal from emp where ename like 'A%';
+-------+---------+
| ename | sal     |
+-------+---------+
| ALLEN | 1600.00 |
| ADAMS | 1100.00 |
+-------+---------+
2 rows in set (0.00 sec)

#查询以K结尾的
mysql> select ename,sal from emp where ename like '%K';
+-------+---------+
| ename | sal     |
+-------+---------+
| CLARK | 2450.00 |
+-------+---------+
1 row in set (0.00 sec)


#查询包含i的
mysql> select ename,sal from emp where ename like '%i%';
+--------+---------+
| ename  | sal     |
+--------+---------+
| SIMITH |  800.00 |
| MARTIN | 1250.00 |
| KING   | 5000.00 |
| MILLER | 1300.00 |
+--------+---------+
4 rows in set (0.00 sec)

#查询第二个字母是A的
mysql> select ename,sal from emp where ename like '_A%';
+--------+---------+
| ename  | sal     |
+--------+---------+
| WARD   | 1250.00 |
| MARTIN | 1250.00 |
| JAMES  |  950.00 |
+--------+---------+
3 rows in set (0.00 sec)
```

### sql查询--排序

使用`order by`来指定按照某字段排序，默认使用升序`asc`（从小到大），使用`desc`可将升序改为降序，如果有`where`条件语句，`order by`要放在`where`后面，如下：

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)


#按照单个字段排序
mysql> select ename,sal from emp where sal >1500 order by sal;
+-------+---------+
| ename | sal     |
+-------+---------+
| ALLEN | 1600.00 |
| CLARK | 2450.00 |
| BLAKE | 2850.00 |
| JONES | 2975.00 |
| SCOTT | 3000.00 |
| FORD  | 3000.00 |
| KING  | 5000.00 |
+-------+---------+
7 rows in set (0.00 sec)

#降序排序（从大到小）
mysql> select ename,sal from emp where sal >1500 order by sal desc;
+-------+---------+
| ename | sal     |
+-------+---------+
| KING  | 5000.00 |
| SCOTT | 3000.00 |
| FORD  | 3000.00 |
| JONES | 2975.00 |
| BLAKE | 2850.00 |
| CLARK | 2450.00 |
| ALLEN | 1600.00 |
+-------+---------+
7 rows in set (0.00 sec)

#按照多个字段排序，字段间使用逗号隔开
mysql> select ename,sal,deptno from emp where sal >1500 order by sal,deptno;
+-------+---------+--------+
| ename | sal     | deptno |
+-------+---------+--------+
| ALLEN | 1600.00 |     30 |
| CLARK | 2450.00 |     10 |
| BLAKE | 2850.00 |     30 |
| JONES | 2975.00 |     20 |
| SCOTT | 3000.00 |     20 |
| FORD  | 3000.00 |     20 |
| KING  | 5000.00 |     10 |
+-------+---------+--------+
7 rows in set (0.00 sec)
```

### sql查询--数据处理函数

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)
```

#### lower 大写-->小写

```sql
mysql> select lower(ename) from emp;
+--------------+
| lower(ename) |
+--------------+
| simith       |
| allen        |
| ward         |
| jones        |
| martin       |
| blake        |
| clark        |
| scott        |
| king         |
| turner       |
| adams        |
| james        |
| ford         |
| miller       |
+--------------+
14 rows in set (0.00 sec)
```

#### upper 小写-->大写

```sql
## 变大写
mysql> select ename,job from emp where upper(job)="MANAGER";
+-------+---------+
| ename | job     |
+-------+---------+
| JONES | MANAGER |
| BLAKE | MANAGER |
| CLARK | MANAGER |
+-------+---------+
3 rows in set (0.00 sec)
```

#### substr 子字符串

子字符串

```sql
#查询以S开头的ename
mysql> select ename from emp where substr(ename,1,1)="S";
+--------+
| ename  |
+--------+
| SIMITH |
| SCOTT  |
+--------+
2 rows in set (0.00 sec)
```

#### length 长度

```sql
mysql> select ename,length(ename) from emp where length(ename)=5;
+-------+---------------+
| ename | length(ename) |
+-------+---------------+
| ALLEN |             5 |
| JONES |             5 |
| BLAKE |             5 |
| CLARK |             5 |
| SCOTT |             5 |
| ADAMS |             5 |
| JAMES |             5 |
+-------+---------------+
7 rows in set (0.00 sec)
```

#### trim 去掉首尾空格

`trim`会去**首尾空格**，不会去除中间的空格

```sql
mysql> select ename,job from emp where job=trim("   MANAGER  ");
+-------+---------+
| ename | job     |
+-------+---------+
| JONES | MANAGER |
| BLAKE | MANAGER |
| CLARK | MANAGER |
+-------+---------+
3 rows in set (0.00 sec)
```

#### date_format 日期-->特定字符串

该函数的作用是：将日期类型数据转换成具有特定格式的日期字符串`varchar`，客户需要特殊格式展示的时候可能用到。

语法格式大致如：`date_format(hiredate, '%Y-%m-%d %H:%i:%s')`

- `%Y`：代表`4`位的年份
- `%y`：代表`2`位的年份
- `%m`：代表月, 格式为`(01……12)`  
- `%c`：代表月, 格式为`(1……12)`
- `%H`：代表小时,格式为`(00……23)`  
- `%h`： 代表小时,格式为`(01……12)`  
- `%i`： 代表分钟, 格式为`(00……59)` 
- `%r`：代表 时间,格式为`12` 小时`(hh:mm:ss [AP]M)`  
- `%T`：代表 时间,格式为`24` 小时`(hh:mm:ss)` 
- `%S`：代表 秒,格式为`(00……59)`  
- `%s`：代表 秒,格式为`(00……59)` 

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,date_format(hiredate,'%Y-%m') from emp where sal>2800;
+-------+-------------------------------+
| ename | date_format(hiredate,'%Y-%m') |
+-------+-------------------------------+
| JONES | 1981-04                       |
| BLAKE | 1981-05                       |
| SCOTT | 1987-04                       |
| KING  | 1981-11                       |
| FORD  | 1981-12                       |
+-------+-------------------------------+
5 rows in set (0.00 sec)

mysql> select ename,date_format(hiredate,'%Y-%m-%d %H:%i:%s') from emp where sal>2800;
+-------+-------------------------------------------+
| ename | date_format(hiredate,'%Y-%m-%d %H:%i:%s') |
+-------+-------------------------------------------+
| JONES | 1981-04-02 00:00:00                       |
| BLAKE | 1981-05-01 00:00:00                       |
| SCOTT | 1987-04-19 00:00:00                       |
| KING  | 1981-11-17 00:00:00                       |
| FORD  | 1981-12-03 00:00:00                       |
+-------+-------------------------------------------+
5 rows in set (0.00 sec)
```

#### str_to_date 字符串-->日期

**将字符串转换成日期**，具体语法格式：`str_to_date` (字符串，匹配格式)

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename,hiredate from emp where hiredate=str_to_date('1981-02-20','%Y-%m-%d');
+-------+------------+
| ename | hiredate   |
+-------+------------+
| ALLEN | 1981-02-20 |
+-------+------------+
1 row in set (0.00 sec)
```

#### foramt 千分位

加入千分位，指定小数位数

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#加入千分位
mysql> select format(sal,0) from emp;
+---------------+
| format(sal,0) |
+---------------+
| 800           |
| 1,600         |
| 1,250         |
| 2,975         |
| 1,250         |
| 2,850         |
| 2,450         |
| 3,000         |
| 5,000         |
| 1,500         |
| 1,100         |
| 950           |
| 3,000         |
| 1,300         |
+---------------+
14 rows in set (0.00 sec)

#加入千分位，并指定一位小数
mysql> select format(sal,1) from emp;
+---------------+
| format(sal,1) |
+---------------+
| 800.0         |
| 1,600.0       |
| 1,250.0       |
| 2,975.0       |
| 1,250.0       |
| 2,850.0       |
| 2,450.0       |
| 3,000.0       |
| 5,000.0       |
| 1,500.0       |
| 1,100.0       |
| 950.0         |
| 3,000.0       |
| 1,300.0       |
+---------------+
14 rows in set (0.00 sec)
```

#### round 四舍五入

**四舍五入**

```
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select round(*) from emp where sal >3000;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '*) from emp where sal >3000' at line 1
mysql> select round(sal) from emp where sal >3000;
+------------+
| round(sal) |
+------------+
|       5000 |
+------------+
1 row in set (0.00 sec)
```

#### rand随机数

`rand`生成`0-1`的随机数，可应用于随机抽取行数（**记录**），`limit`用来限制抽取的个数。

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#根据rand()生成的数字进行排序，并抽取前两个记录
mysql> select * from emp order by rand() limit 2;
+-------+--------+----------+------+------------+---------+--------+--------+
| empno | ename  | job      | mgr  | hiredate   | sal     | comm   | deptno |
+-------+--------+----------+------+------------+---------+--------+--------+
|  7499 | ALLEN  | SALESMAN | 7698 | 1981-02-20 | 1600.00 | 300.00 |     30 |
|  7844 | TURNER | SALESMAN | 7698 | 1981-09-08 | 1500.00 |   NULL |     30 |
+-------+--------+----------+------+------------+---------+--------+--------+
2 rows in set (0.00 sec)
```

#### case … when … then …..else …end as...

`case...when … then …..else …end...as...`用来输出一个新字段的，这个字段是通过判断得出来的。意思是，如果某个字段的值为..则..否则...，作为...输出。

语法大致格式：`select case … when … then …..else …end...as... from ...`

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#给工作为clerk的员工加工资，给其它工作岗位的员工减工资
mysql> select ename,job,sal,case job when "clerk" then sal*1.1 else sal*0.9 end from emp;
+--------+-----------+---------+-----------------------------------------------------+
| ename  | job       | sal     | case job when "clerk" then sal*1.1 else sal*0.9 end |
+--------+-----------+---------+-----------------------------------------------------+
| SIMITH | CLERK     |  800.00 |                                              880.00 |
| ALLEN  | SALESMAN  | 1600.00 |                                             1440.00 |
| WARD   | SALESMAN  | 1250.00 |                                             1125.00 |
| JONES  | MANAGER   | 2975.00 |                                             2677.50 |
| MARTIN | SALESMAN  | 1250.00 |                                             1125.00 |
| BLAKE  | MANAGER   | 2850.00 |                                             2565.00 |
| CLARK  | MANAGER   | 2450.00 |                                             2205.00 |
| SCOTT  | ANALYST   | 3000.00 |                                             2700.00 |
| KING   | PRESIDENT | 5000.00 |                                             4500.00 |
| TURNER | SALESMAN  | 1500.00 |                                             1350.00 |
| ADAMS  | CLERK     | 1100.00 |                                             1210.00 |
| JAMES  | CLERK     |  950.00 |                                             1045.00 |
| FORD   | ANALYST   | 3000.00 |                                             2700.00 |
| MILLER | CLERK     | 1300.00 |                                             1430.00 |
+--------+-----------+---------+-----------------------------------------------------+
14 rows in set (0.00 sec)

## 使用as给新字段命名
mysql> select ename,job,sal,case job when "clerk" then sal*1.1 else sal*0.9 end as new_sal from emp;
+--------+-----------+---------+---------+
| ename  | job       | sal     | new_sal |
+--------+-----------+---------+---------+
| SIMITH | CLERK     |  800.00 |  880.00 |
| ALLEN  | SALESMAN  | 1600.00 | 1440.00 |
| WARD   | SALESMAN  | 1250.00 | 1125.00 |
| JONES  | MANAGER   | 2975.00 | 2677.50 |
| MARTIN | SALESMAN  | 1250.00 | 1125.00 |
| BLAKE  | MANAGER   | 2850.00 | 2565.00 |
| CLARK  | MANAGER   | 2450.00 | 2205.00 |
| SCOTT  | ANALYST   | 3000.00 | 2700.00 |
| KING   | PRESIDENT | 5000.00 | 4500.00 |
| TURNER | SALESMAN  | 1500.00 | 1350.00 |
| ADAMS  | CLERK     | 1100.00 | 1210.00 |
| JAMES  | CLERK     |  950.00 | 1045.00 |
| FORD   | ANALYST   | 3000.00 | 2700.00 |
| MILLER | CLERK     | 1300.00 | 1430.00 |
+--------+-----------+---------+---------+
14 rows in set (0.00 sec)

#给工作为clerk和salesman的员工加工资，给其它工作岗位的员工减工资
mysql> select ename,job,sal,case job when "clerk" then sal*1.1 when "salesman" then sal*1.2 else sal*0.9 end as new_sal from emp;
+--------+-----------+---------+---------+
| ename  | job       | sal     | new_sal |
+--------+-----------+---------+---------+
| SIMITH | CLERK     |  800.00 |  880.00 |
| ALLEN  | SALESMAN  | 1600.00 | 1920.00 |
| WARD   | SALESMAN  | 1250.00 | 1500.00 |
| JONES  | MANAGER   | 2975.00 | 2677.50 |
| MARTIN | SALESMAN  | 1250.00 | 1500.00 |
| BLAKE  | MANAGER   | 2850.00 | 2565.00 |
| CLARK  | MANAGER   | 2450.00 | 2205.00 |
| SCOTT  | ANALYST   | 3000.00 | 2700.00 |
| KING   | PRESIDENT | 5000.00 | 4500.00 |
| TURNER | SALESMAN  | 1500.00 | 1800.00 |
| ADAMS  | CLERK     | 1100.00 | 1210.00 |
| JAMES  | CLERK     |  950.00 | 1045.00 |
| FORD   | ANALYST   | 3000.00 | 2700.00 |
| MILLER | CLERK     | 1300.00 | 1430.00 |
+--------+-----------+---------+---------+
14 rows in set (0.00 sec)
```

#### ifnull 如果为空则...

示例：`ifnulll(comm,0)` ---->如果`comm`为空，则变为`0`。

当运算涉及到`null`的时候，运算结果都会是`null`，有时候为了避免这种情况，我们可以使用`ifnull`，

```sql
mysql> select comm from emp;
+---------+
| comm    |
+---------+
|    NULL |
|  300.00 |
|  500.00 |
|    NULL |
| 1400.00 |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
|    NULL |
+---------+
14 rows in set (0.00 sec)

mysql> select ifnull(comm,0) from emp;
+----------------+
| ifnull(comm,0) |
+----------------+
|           0.00 |
|         300.00 |
|         500.00 |
|           0.00 |
|        1400.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
|           0.00 |
+----------------+
14 rows in set (0.00 sec)
```

### sql查询--分组/聚合/多行处理函数

#### distinct取得某字段不重复记录

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)


#查询工作岗位类型有多少个
mysql> select distinct job from emp;
+-----------+
| job       |
+-----------+
| CLERK     |
| SALESMAN  |
| MANAGER   |
| ANALYST   |
| PRESIDENT |
+-----------+
5 rows in set (0.00 sec)
```



#### count取得记录数(行数)

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#取得记录数
mysql> select count(*) from emp;
+----------+
| count(*) |
+----------+
|       14 |
+----------+
1 row in set (0.10 sec)

#取得comm不为空的记录数
mysql> select count(comm) from emp;
+-------------+
| count(comm) |
+-------------+
|           3 |
+-------------+
1 row in set (0.10 sec)

## 统计job字段不重复的记录数
mysql> select count(distinct job) from emp;
+---------------------+
| count(distinct job) |
+---------------------+
|                   5 |
+---------------------+
1 row in set (0.00 sec)
```

#### sum求和

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select sum(sal+ifnull(comm,0)) from emp;
+-------------------------+
| sum(sal+ifnull(comm,0)) |
+-------------------------+
|                31225.00 |
+-------------------------+
1 row in set (0.01 sec)
```

#### avg 求平均值（TODO）

#### max求最大值

#### min求最小值



### sql查询--分组查询 group by

`group by`的作用是，根据某个字段或者某些字段来进行分组查询。

如果有排序`order by`的时候，`order by`要跟在`group by`的后面。

#### 案例1：根据单个字段来分组查询

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

#根据job进行分组，求不同岗位的平均工资
mysql> select job,avg(sal) from emp group by job;
+-----------+-------------+
| job       | avg(sal)    |
+-----------+-------------+
| CLERK     | 1037.500000 |
| SALESMAN  | 1400.000000 |
| MANAGER   | 2758.333333 |
| ANALYST   | 3000.000000 |
| PRESIDENT | 5000.000000 |
+-----------+-------------+
5 rows in set (0.00 sec)

#根据job进行分组，求不同岗位的平均工资，新列名称改为avg_sal
mysql> select job,avg(sal) as avg_sal from emp group by job;
+-----------+-------------+
| job       | avg_sal     |
+-----------+-------------+
| CLERK     | 1037.500000 |
| SALESMAN  | 1400.000000 |
| MANAGER   | 2758.333333 |
| ANALYST   | 3000.000000 |
| PRESIDENT | 5000.000000 |
+-----------+-------------+
5 rows in set (0.00 sec)

#根据job进行分组，求不同岗位的平均工资，并进行降序排序。
mysql> select job,avg(sal) as avg_sal from emp group by job order by avg_sal desc;
+-----------+-------------+
| job       | avg_sal     |
+-----------+-------------+
| PRESIDENT | 5000.000000 |
| ANALYST   | 3000.000000 |
| MANAGER   | 2758.333333 |
| SALESMAN  | 1400.000000 |
| CLERK     | 1037.500000 |
+-----------+-------------+
5 rows in set (0.00 sec)
```

#### 案例2：根据多个字段来分组查询

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select job,deptno,avg(sal) as avg_sal from emp group by job,deptno;
+-----------+--------+-------------+
| job       | deptno | avg_sal     |
+-----------+--------+-------------+
| CLERK     |     20 |  950.000000 |
| SALESMAN  |     30 | 1400.000000 |
| MANAGER   |     20 | 2975.000000 |
| MANAGER   |     30 | 2850.000000 |
| MANAGER   |     10 | 2450.000000 |
| ANALYST   |     20 | 3000.000000 |
| PRESIDENT |     10 | 5000.000000 |
| CLERK     |     30 |  950.000000 |
| CLERK     |     10 | 1300.000000 |
+-----------+--------+-------------+
9 rows in set (0.00 sec)
```

### sql查询--分组后过滤 having

使用`group by`分组后，如果过滤数据，可以使用`having`。

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select job,avg(sal) as avg_sal from emp group by job having avg_sal>=3000;
+-----------+-------------+
| job       | avg_sal     |
+-----------+-------------+
| ANALYST   | 3000.000000 |
| PRESIDENT | 5000.000000 |
+-----------+-------------+
2 rows in set (0.00 sec)
```

### sql查询--跨表查询(连接查询)

分两种语法：`sql92`和`sql99`，推荐使用`sql99`语法。

`sql99`语法可以做到表的连接条件和查询条件分离，特别是多个表进行连接的时候，会比`sql92`更清晰。

#### 案例1：内连接--连接条件相等的数据 sql92

```sql
mysql> select * from dept;
+--------+-------------+----------+
| deptno | dname       | loc      |
+--------+-------------+----------+
|     10 | ACCOUNTING  | NEW YORK |
|     20 | RESEARCHING | DALLAS   |
|     30 | SALES       | CHICAGO  |
|     40 | OPERATIONS  | BOSTON   |
+--------+-------------+----------+
4 rows in set (0.00 sec)

mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

## 以deptno相同作为连接条件，进行跨表查询
mysql> select emp.ename,emp.deptno,dept.deptno,dept.dname from emp,dept where emp.deptno=dept.deptno;
+--------+--------+--------+-------------+
| ename  | deptno | deptno | dname       |
+--------+--------+--------+-------------+
| SIMITH |     20 |     20 | RESEARCHING |
| ALLEN  |     30 |     30 | SALES       |
| WARD   |     30 |     30 | SALES       |
| JONES  |     20 |     20 | RESEARCHING |
| MARTIN |     30 |     30 | SALES       |
| BLAKE  |     30 |     30 | SALES       |
| CLARK  |     10 |     10 | ACCOUNTING  |
| SCOTT  |     20 |     20 | RESEARCHING |
| KING   |     10 |     10 | ACCOUNTING  |
| TURNER |     30 |     30 | SALES       |
| ADAMS  |     20 |     20 | RESEARCHING |
| JAMES  |     30 |     30 | SALES       |
| FORD   |     20 |     20 | RESEARCHING |
| MILLER |     10 |     10 | ACCOUNTING  |
+--------+--------+--------+-------------+
14 rows in set (0.00 sec)


## 以deptno相同作为连接条件，进行跨表查询
mysql> select emp.ename,dept.dname from emp,dept where emp.deptno=dept.deptno;
+--------+-------------+
| ename  | dname       |
+--------+-------------+
| SIMITH | RESEARCHING |
| ALLEN  | SALES       |
| WARD   | SALES       |
| JONES  | RESEARCHING |
| MARTIN | SALES       |
| BLAKE  | SALES       |
| CLARK  | ACCOUNTING  |
| SCOTT  | RESEARCHING |
| KING   | ACCOUNTING  |
| TURNER | SALES       |
| ADAMS  | RESEARCHING |
| JAMES  | SALES       |
| FORD   | RESEARCHING |
| MILLER | ACCOUNTING  |
+--------+-------------+
14 rows in set (0.00 sec)
```

#### 案例1：内连接--连接条件相等的数据 sql99

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select emp.ename,dept.dname,emp.sal from emp join dept on emp.deptno=dept.deptno;
+--------+-------------+---------+
| ename  | dname       | sal     |
+--------+-------------+---------+
| SIMITH | RESEARCHING |  800.00 |
| ALLEN  | SALES       | 1600.00 |
| WARD   | SALES       | 1250.00 |
| JONES  | RESEARCHING | 2975.00 |
| MARTIN | SALES       | 1250.00 |
| BLAKE  | SALES       | 2850.00 |
| CLARK  | ACCOUNTING  | 2450.00 |
| SCOTT  | RESEARCHING | 3000.00 |
| KING   | ACCOUNTING  | 5000.00 |
| TURNER | SALES       | 1500.00 |
| ADAMS  | RESEARCHING | 1100.00 |
| JAMES  | SALES       |  950.00 |
| FORD   | RESEARCHING | 3000.00 |
| MILLER | ACCOUNTING  | 1300.00 |
+--------+-------------+---------+
14 rows in set (0.00 sec)


mysql> select e.ename,d.dname,e.sal from emp e join dept d on e.deptno=d.deptno where e.sal>1500;
+-------+-------------+---------+
| ename | dname       | sal     |
+-------+-------------+---------+
| ALLEN | SALES       | 1600.00 |
| JONES | RESEARCHING | 2975.00 |
| BLAKE | SALES       | 2850.00 |
| CLARK | ACCOUNTING  | 2450.00 |
| SCOTT | RESEARCHING | 3000.00 |
| KING  | ACCOUNTING  | 5000.00 |
| FORD  | RESEARCHING | 3000.00 |
+-------+-------------+---------+
7 rows in set (0.01 sec)
```

#### 案例3：自连接（内连接的一种特殊情况）

自连接是把一张表当成两张表进行连接。

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)
#empno是员工编号
#mgr是员工对应的上级领导的员工编号。（领导也是公司里的员工）
#ename是员工名称

mysql> select e.ename as "员工名称",m.ename as "员工上级领导名称",m.empno as "领导的员工编号" from emp e join emp m on e.mgr=m.empno;
+--------------+--------------------------+-----------------------+
| 员工名称      | 员工上级领导名称            | 领导的员工编号          |
+--------------+--------------------------+-----------------------+
| SIMITH       | FORD                     |                  7902 |
| ALLEN        | BLAKE                    |                  7698 |
| WARD         | BLAKE                    |                  7698 |
| JONES        | KING                     |                  7839 |
| MARTIN       | BLAKE                    |                  7698 |
| BLAKE        | KING                     |                  7839 |
| CLARK        | KING                     |                  7839 |
| SCOTT        | JONES                    |                  7566 |
| TURNER       | BLAKE                    |                  7698 |
| ADAMS        | SCOTT                    |                  7788 |
| JAMES        | BLAKE                    |                  7698 |
| FORD         | JONES                    |                  7566 |
| MILLER       | CLARK                    |                  7782 |
+--------------+--------------------------+-----------------------+
13 rows in set (0.00 sec)
```

#### 案例4：外连接

左外连接`left join`：以左表作为比较标准，左表的字段所有记录都会显示，但是右表的不一定。

右外连接`right join`：以左表作为比较标准，右表的字段所有记录都会显示，但是左表的不一定。

```sql
create table t1(name varchar(15) not null,id1 int not null);
create table t2(name varchar(15) not null,id2 int not null);

insert t1 values("krystal",10),("jimmy",20),("love",40);
insert t2 values("jimmy",10),("krystal",20),("love",30);

mysql> select * from t1;
+---------+-----+
| name    | id1 |
+---------+-----+
| krystal |  10 |
| jimmy   |  20 |
| love    |  40 |
+---------+-----+
3 rows in set (0.00 sec)

mysql> select * from t2;
+---------+-----+
| name    | id2 |
+---------+-----+
| jimmy   |  10 |
| krystal |  20 |
| love    |  30 |
+---------+-----+
3 rows in set (0.00 sec)


#左外连接
mysql> select t1.name,t2.name from t1 left join t2 on t1.id1=t2.id2;
+---------+---------+
| name    | name    |
+---------+---------+
| krystal | jimmy   |
| jimmy   | krystal |
| love    | NULL    |
+---------+---------+
3 rows in set (0.00 sec)

#左右连接
mysql> select t1.name,t2.name from t1 right join t2 on t1.id1=t2.id2;
+---------+---------+
| name    | name    |
+---------+---------+
| krystal | jimmy   |
| jimmy   | krystal |
| NULL    | love    |
+---------+---------+
3 rows in set (0.00 sec)
```

### sql查询--子查询

第二个`select`查询语句一定要用括号括起来。

#### where中使用子查询

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)


## 查看salesman岗位拿到的最高工资
mysql> select job,sal as "最高工资" from emp where job="salesman" and sal >= ALL(select sal from emp where job="salesman");
+----------+--------------+
| job      | 最高工资      |
+----------+--------------+
| SALESMAN |      1600.00 |
+----------+--------------+
1 row in set (0.00 sec)
```

#### from中使用子查询

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

## 查询工资大于3000的工作
mysql> select m.job from (select * from emp where sal >3000) m;
+-----------+
| job       |
+-----------+
| PRESIDENT |
+-----------+
1 row in set (0.00 sec)
```

#### select中使用子查询（TODO）

### sql查询--union合并

`UNION` 操作符用于合并两个或多个 `SELECT` 语句的结果集。

请注意，`UNION` 内部的 `SELECT` 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 `SELECT` 语句中的列的顺序必须相同。

默认地，`UNION` 操作符选取不同的值。如果允许重复的值，请使用 `UNION ALL`

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select job from emp where job in ("manager","clerk");
+---------+
| job     |
+---------+
| CLERK   |
| MANAGER |
| MANAGER |
| MANAGER |
| CLERK   |
| CLERK   |
| CLERK   |
+---------+
7 rows in set (0.00 sec)

#使用union all
mysql> select job from emp  where job ="manager" union all select job from emp where job ="clerk";
+---------+
| job     |
+---------+
| MANAGER |
| MANAGER |
| MANAGER |
| CLERK   |
| CLERK   |
| CLERK   |
| CLERK   |
+---------+
7 rows in set (0.00 sec)

#使用union
mysql> select job from emp  where job ="manager" union select job from emp where job ="clerk";
+---------+
| job     |
+---------+
| MANAGER |
| CLERK   |
+---------+
2 rows in set (0.00 sec)
```

### sql查询--limit提取某几行数据

`limit`是`mysql`的特色语句，主要用于提取前几条或者中间某几行数据

语法格式：`select * from table limit m,n`

其中`m`是指记录开始的`index`，从`0`开始，表示第一条记录

`n`是指从第`m+1`条开始，取`n`条。

`select * from tablename limit 2,4`

即取出第`3`条至第`6`条，`4`条记录。

```sql
mysql> select * from emp;
+-------+--------+-----------+------+------------+---------+---------+--------+
| empno | ename  | job       | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+-----------+------+------------+---------+---------+--------+
|  7369 | SIMITH | CLERK     | 7902 | 1980-12-17 |  800.00 |    NULL |     20 |
|  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |
|  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |
|  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |    NULL |     20 |
|  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |
|  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |    NULL |     30 |
|  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |    NULL |     10 |
|  7788 | SCOTT  | ANALYST   | 7566 | 1987-04-19 | 3000.00 |    NULL |     20 |
|  7839 | KING   | PRESIDENT | NULL | 1981-11-17 | 5000.00 |    NULL |     10 |
|  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    NULL |     30 |
|  7876 | ADAMS  | CLERK     | 7788 | 1987-05-23 | 1100.00 |    NULL |     20 |
|  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |    NULL |     30 |
|  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |    NULL |     20 |
|  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |    NULL |     10 |
+-------+--------+-----------+------+------------+---------+---------+--------+
14 rows in set (0.00 sec)

mysql> select ename from emp limit 4;
+--------+
| ename  |
+--------+
| SIMITH |
| ALLEN  |
| WARD   |
| JONES  |
+--------+
4 rows in set (0.00 sec)

mysql> select ename from emp limit 3,4;
+--------+
| ename  |
+--------+
| JONES  |
| MARTIN |
| BLAKE  |
| CLARK  |
+--------+
4 rows in set (0.00 sec)

#配合排序使用，可以查询排名前几的工资，查询Top5工资信息
mysql> select ename,job,sal from emp order by sal desc limit 5;
+-------+-----------+---------+
| ename | job       | sal     |
+-------+-----------+---------+
| KING  | PRESIDENT | 5000.00 |
| FORD  | ANALYST   | 3000.00 |
| SCOTT | ANALYST   | 3000.00 |
| JONES | MANAGER   | 2975.00 |
| BLAKE | MANAGER   | 2850.00 |
+-------+-----------+---------+
5 rows in set (0.00 sec)
```

## 视图

#### :one:为什么需要视图？

观看下图，要为不同的人设置不同的查询权限和范围，所以，视图就是用来满足不同用户的不同需求的。

<img src="mysql.assets/image-20200610155720937.png" alt="image-20200610155720937" style="zoom: 33%;" />

#### :two:视图的介绍

视图是一张虚拟表

- 表示一张表的部分数据或多张表的综合数据
- 其结构和数据是建立在对表查询基础上的

视图不存放数据

- 数据存放在视图所引用的原始表中

一个原始表，根据不同用户的不同需求，可以创建多个不同的视图

视图的用途

- 筛选表中的行
- 防止未经许可的用户访问敏感数据
- 降低数据库的复杂程度
- 将多个物理数据库抽象为一个逻辑数据库

#### :three:视图的相关操作

使用sql语句删除、创建和查看视图：

```sql
DROP  VIEW if exists `student_result`;   删除视图
create view `student_result` as .... 创建视图
select *  from `student_result`;   查看视图
```

#### :four:使用视图的注意事项

注意事项

- 视图中可以使用多个表
- 一个视图可以嵌套另一个视图
- 对视图数据进行添加、删除和更新等操作直接影响所有引用表中的数据
- 当视图数据来自多个表时，不允许添加和删除数据

提示

- 查看存在的所有视图
  - `use information_schema;`
  - `select * from view;`

经验

- 使用视图修改数据会有很多限制，一般实际开发中**视图仅用作查询**。

## TIMESTAMP

sql的TIMESTAMP有两个属性：CURRENT_TIMESTAMP 和ON UPDATE CURRENT_TIMESTAMP，这两个属性分别是用来记录insert插入数据的时间，而ON UPDATE CURRENT_TIMESTAMP用来记录update更新数据的时间。

example:

```sql
CREATE TABLE `emp` (
  `id` INT(11) DEFAULT NULL,
  `name` VARCHAR(100) DEFAULT NULL,
  `deg` VARCHAR(100) DEFAULT NULL,
  `salary` INT(11) DEFAULT NULL,
  `dept` VARCHAR(10) DEFAULT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
) ENGINE=INNODB DEFAULT CHARSET=latin1;

mysql> insert into emp (name) values("jimmy");

mysql> select * from emp;
+------+-------+------+--------+------+---------------------+---------------------+
| id   | name  | deg  | salary | dept | create_time         | update_time         | 
+------+-------+------+--------+------+---------------------+---------------------+
| NULL | jimmy | NULL | NULL   | NULL | 2020-03-14 17:10:01 | 2020-03-14 17:10:01 |
+------+-------+------+--------+------+---------------------+---------------------+
```

## mysql密码+用户+权限管理

#### :one:mysql密码等级/长度

###### 设定mysql密码等级

通过设置 validate_password_policy 的全局参数来设定密码等级：

```sql
set global validate_password_policy=LOW; 
```

设定密码等级为LOW后，就只会验证密码的长度了。

###### 设定密码长度：(默认长度是8)

```sql
mysql> set global validate_password_length=6;
```



#### :two:查看/新建/删除mysql用户

##### 查看现有用户：

```sql
mysql> select host,user from mysql.user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```

##### 新建用户：

语法格式：**create user "username"@"host" identified by "password";**

host="localhost"为本地登录用户，host="ip"为ip地址登录，host="%"，为外网ip登录

```sql
mysql> create user "krystal"@"%" identified by "123456";

mysql> select host,user from mysql.user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | krystal          |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```

##### 修改用户名

```sql
mysql> rename user 'jack'@'%' to 'jim'@'%';
```

##### 删除用户

语法格式：drop user "username"@"host"

##### 修改用户密码

```sql
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('123456');
```

------



#### :three:赋予mysql用户权限

##### 查看当前用户权限

```sql
mysql> show grants;
+-------------------------------------+
| Grants for krystal@%                |
+-------------------------------------+
| GRANT USAGE ON *.* TO `krystal`@`%` |
+-------------------------------------+
```

##### 查看某个用户权限

```sql
mysql> show grants for "krystal"@"%";
+-------------------------------------+
| Grants for krystal@%                |
+-------------------------------------+
| GRANT USAGE ON *.* TO `krystal`@`%` |
+-------------------------------------+
```

##### 赋予权限

语法格式：**grant privileges on databasename.tablename to 'username'@'host' IDENTIFIED BY 'PASSWORD';**

- privileges表示要赋予的权限，可以是all priveleges, 表示所有权限，也可以是select、update等权限。多个权限的名词,相互之间用逗号分开。
- on databasename.tablename表示权限针对哪些库哪些表
- to 'username'@'host' IDENTIFIED BY 'PASSWORD'表示赋予权限给哪个用户

```sql
/*授予用户通过外网IP对于该数据库的全部权限*/
grant all privileges on `test`.* to 'test'@'%' ;

/*授予用户在本地服务器对该数据库的全部权限*/

grant all privileges on `test`.* to 'test'@'localhost';   

grant select on test.* to 'user1'@'localhost';  /*给予查询权限*/

grant insert on test.* to 'user1'@'localhost'; /*添加插入权限*/

grant delete on test.* to 'user1'@'localhost'; /*添加删除权限*/

grant update on test.* to 'user1'@'localhost'; /*添加权限*/

flush privileges; /*刷新权限*/
```

##### 权限控制经验

权限控制主要是出于安全因素，因此需要遵循一下几个经验原则：

- 只授予能满足需要的最小权限，防止用户干坏事。比如用户只是需要查询，那就只给select权限就可以了，不要给用户赋予update、insert或者delete权限。
- 创建用户的时候限制用户的登录主机，一般是限制成指定IP或者内网IP段。
- 初始化数据库的时候删除没有密码的用户。安装完数据库的时候会自动创建一些用户，这些用户默认没有密码。
- 为每个用户设置满足密码复杂度的密码。
- 定期清理不需要的用户。回收权限或者删除用户。

## 事务

![image-20200518134748072](mysql.assets/image-20200518134748072.png)

#### 16.1、概述

事务可以保证多个操作原子性，**要么全成功，要么全失败**。对于数据库来说事务保证批量的DML要么全成功，要么全失败。事务具有四个特征ACID

a)  原子性（`Atomicity`）

​		整个事务中的所有操作，必须**作为一个单元全部完成**（或全部取消）。

b)  一致性（`Consistency`）

​		在事务开始之前与结束之后，数据库都**保持一致状态**。

c)  隔离性(`Isolation`)

​		一个事务**不会影响**其他事务的运行。

d)  持久性(`Durability`)

​		在事务完成以后，该事务对数据库所作的更改将**持久地保存**在数据库之中，并不会被回滚。

事务中存在一些概念：

- a)  事务（`Transaction`）：一批操作（一组`DML`）
- b)  开启事务（`Start Transaction`）
- c)  回滚事务（`rollback`）
- d)  提交事务（`commit`）
- e)  SET AUTOCOMMIT：禁用或启用事务的自动提交模式

当执行DML语句是其实就是开启一个事务

关于事务的回滚需要注意：**只能回滚insert、delete和update语句，不能回滚select**（回滚select没有任何意义），对于`create`、`drop`、`alter`这些无法回滚.

**事务只对DML有效果。**

注意：`rollback`，或者`commit`后事务就结束了。

#### 16.2、事务的提交与回滚演示 

1)  创建表

```sql
create table user(id int (11) primary key  not null auto_increment,username varchar(30),  password varchar(30)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

2)  查询表中数据

![img](mysql.assets/clip_image001-1589781083888.png)

3)  开启事务`START TRANSACTION;`

```sql
start transaction;
```

4)  插入数据

```sql
insert into user (username,password) values ('zhangsan','123');
```

5)  查看数据

```sql
mysql> select * from user;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | zhangsan | 123      |
+----+----------+----------+
1 row in set (0.00 sec)
```

6)  修改数据并查看数据：

```sql
mysql> update user set username="lisi" where id =1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from user;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | lisi     | 123      |
+----+----------+----------+
1 row in set (0.00 sec)
```

7)  回滚事务并查看数据：

```sql
mysql> rollback;
Query OK, 0 rows affected (0.01 sec)

mysql> select * from user;
Empty set (0.00 sec)
```

#### 16.3、自动提交模式

自动提交模式用于**决定新事务如何及何时启动。** 

 启用自动提交模式：

- –    如果自动提交模式被启用，则**单条DML语句将缺省地开始一个新的事务**。 
- –    如果该语句执行**成功**，事务将**自动提交**，并永久地保存该语句的执行结果。 
- –    如果语句执行**失败**，事务将**自动回滚**，并取消该语句的结果。 
- –    在自动提交模式下，仍可使用START TRANSACTION语句来显式地启动事务。这时，一个事务仍可包含多条语句，直到这些语句被统一提交或回滚。 

禁用自动提交模式： 

- –    如果禁用自动提交，事务可以跨越多条语句。 
- –    在这种情况下，事务可以用COMMIT和ROLLBACK语句来显式地提交或回滚。 

自动提交模式可以通过服务器变量AUTOCOMMIT来控制。 

例如：

```sql
mysql> SET AUTOCOMMIT = OFF； 

mysql> SET AUTOCOMMIT = ON； 

-- 或

mysql> SET SESSION AUTOCOMMIT = OFF； 

mysql> SET SESSION AUTOCOMMIT = ON； 

show variables like '%auto%'; -- 查看变量状态
```

#### 16.4、事务的隔离级别

##### 16.4.1、隔离级别

•    **事务的隔离级别决定了事务之间可见的级别。**

•    当多个客户端并发地访问同一个表时，可能出现下面的一致性问题：

**–    脏读取（Dirty Read）** 

  			一个事务开始读取了某行数据，但是另外一个事务已经更新了此数据但没有能够及时提交，这就出现了脏读取。

**–    不可重复读（Non-repeatable Read）** 

  			在同一个事务中，同一个读操作对同一个数据的前后两次读取产生了不同的结果，这就是不可重复读。

**–    幻像读（Phantom Read）** 

  			幻像读是指在同一个事务中以前没有的行，由于其他事务的提交而**出现的新行**。

##### 16.4.2、四个隔离级别

 InnoDB 实现了**四个隔离级别**，用以**控制事务所做的修改，并将修改通告至其它并发的事务：**

-  读未提交（READ UMCOMMITTED） 
   - 允许一个事务**可以看到其他事务未提交的修改**。

-  读已提交（READ COMMITTED） 
   - 允许一个事务只能看到其他事务已经提交的修改，**未提交的修改是不可见的**。

-  可重复读（REPEATABLE READ） 
   - 确保如果在一个事务中执行**两次相同的SELECT语句，都能得到相同的结果**，**不管其他事务是否提交**这些修改。 （银行总账）
   - ==该隔离级别为InnoDB的缺省设置。==

-  串行化（SERIALIZABLE） 【序列化】
   -   将一个事务与其他事务完全地隔离。 

```
例:A可以开启事物,B也可以开启事物

A在事物中执行DML语句时,未提交

B不以执行DML,DQL语句
```



##### 16.4.3、隔离级别与一致性问题的关系

​	![img](mysql.assets/clip_image002.jpg)

##### 16.4.4、设置服务器缺省隔离级别

###### 通过修改配置文件设置 

可以在`my.ini`文件中使用`transaction-isolation`选项来设置服务器的缺省事务隔离级别。 

 该选项值可以是： 

- READ-UNCOMMITTED
- READ-COMMITTED
- REPEATABLE-READ
- SERIALIZABLE

例如：

```sh
[mysqld]

transaction-isolation = READ-COMMITTED
```

###### 通过命令动态设置隔离级别

隔离级别也可以在运行的服务器中动态设置，应使用SET TRANSACTION ISOLATION LEVEL语句。 

其语法模式为：

```sql
SET [GLOBAL | SESSION] TRANSACTION ISOLATION LEVEL <isolation-level>
```

  其中的`<isolation-level>`可以是：

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

 例如： SET TRANSACTION ISOLATION LEVEL **REPEATABLE READ**;

##### 16.4.5、隔离级别的作用范围

•    事务隔离级别的作用范围分为两种： 

–    **全局级**：对所有的会话有效 

–    **会话级**：只对当前的会话有效 

•    例如，设置会话级隔离级别为READ COMMITTED ：

```sql
mysql> SET TRANSACTION ISOLATION LEVEL READ COMMITTED；

-- 或：

mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED；
```

•    设置全局级隔离级别为READ COMMITTED ： 

```sql
mysql> SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED；
```

##### 16.4.6、查看隔离级别

•    服务器变量tx_isolation（包括会话级和全局级两个变量）中保存着当前的会话隔离级别。 

•    为了查看当前隔离级别，可访问**tx_isolation**变量： 

–    查看会话级的当前隔离级别：

```sql
SELECT @@transaction_isolation; 

  -- 或： 

SELECT @@session.transaction_isolation;    
```

–    查看全局级的当前隔离级别： 

```sql
SELECT @@global.transaction_isolation;
```

##### 16.4.7、并发事务与隔离级别示例

###### read uncommitted(未提交读) --脏读(Drity Read)：

| 会话一                                                       | 会话二                  |
| ------------------------------------------------------------ | ----------------------- |
| mysql>  prompt s1>                                           | mysql>  use bjpowernode |
| s1>use  bjpowernode                                          | mysql>  prompt s2>      |
| s1>create  table tx (  id int(11),  num int (10)  );         |                         |
| s1>set  global transaction isolation level read uncommitted; |                         |
| s1>start  transaction;                                       |                         |
|                                                              | s2>start  transaction;  |
| s1>insert  into tx values (1,10);                            |                         |
|                                                              | s2>select  * from tx;   |
| s1>rollback;                                                 |                         |
|                                                              | s2>select  * from tx;   |

###### read committed(已提交读)

| 会话一                                                      | 会话二                 |
| ----------------------------------------------------------- | ---------------------- |
| s1> set  global transaction isolation level read committed; |                        |
| s1>start  transaction;                                      |                        |
|                                                             | s2>start  transaction; |
| s1>insert  into tx values (1,10);                           |                        |
| s1>select  * from tx;                                       |                        |
|                                                             | s2>select  * from tx;  |
| s1>commit;                                                  |                        |
|                                                             | s2>select  * from tx;  |

###### repeatable read(可重复读) 

| 会话一                                                       | 会话二                 |
| ------------------------------------------------------------ | ---------------------- |
| s1> set  global transaction isolation level repeatable read; |                        |
| s1>start  transaction;                                       | s2>start  transaction; |
| s1>select  * from tx;                                        |                        |
| s1>insert  into tx values (1,10);                            |                        |
|                                                              | s2>select  * from tx;  |
| s1>commit;                                                   |                        |
|                                                              | s2>select  * from tx;  |

## 索引

##### 为什么要建立索引？

查询的时候如果使用不是内存存储引擎，会涉及到磁盘IO

mysql》》关系型数据库》》持久化》》磁盘》》磁盘IO

建立索引，能够让我们的查询速度加快。

##### 索引原理

**索引被用来快速找出在一个列上用一特定值的行**。没有索引，MySQL不得不首先以第一条记录开始，然后读完整个表直到它找出相关的行。表越大，花费时间越多。对于一个有序字段，可以运用二分查找（Binary Search），这就是为什么性能能得到本质上的提高。==MYISAM和INNODB都是用B+Tree作为索引结构==

B+树的结构：

![image-20200610175302638](mysql.assets/image-20200610175302638.png)

**主键，unique 都会默认的添加索引**

##### 索引的应用

###### 17.2.1、创建索引

如果未使用索引，我们查询 工资大于 1500的**会执行全表扫描**

![img](mysql.assets/clip_image002-1589783911069.jpg)

 

**什么时候需要给字段添加索引：**

- 表中该字段中的**数据量庞大**
- 经常被检索，**经常出现在where子句中**的字段
- **经常被DML操作的字段不建议添加索引**

**索引等同于一本书的目录**

**主键会自动添加索引，所以尽量根据主键查询效率较高。**

如经常根据sal进行查询，并且遇到了性能瓶颈，首先查看程序是否存算法问题，再考虑对sal建立索引。

建立索引的方式如下：

 1、create unique index 索引名 on 表名(列名); 

```sql
create unique index u_ename on emp(ename);
```

 2、alter table 表名 add unique index 索引名 (列名); 

###### 17.2.2、查看索引

```sql
 show index  from 表名;  
```

###### 17.2.3、使用索引

注意一定不可以用select * … 可以看到type!=all了，说明使用了索引

```sql
explain  select sal from emp where sal > 1500;  
```

条件中的sal使用了索引

![img](mysql.assets/clip_image007.jpg)

如下图：假如我们要查找sal大于1500的所有行，那么可以扫描索引，索引时排序的，结果得出7行，我们知道不会再有匹配的记录，可以退出了。

如果查找一个值，它在索引表中某个中间点以前不会出现，那么也有找到其第一个匹配索引项的定位算法，而不用进行表的顺序扫描（**如二分查找法**）。

 这样，可以快速定位到第一个匹配的值，以节省大量搜索时间。数据库**利用了各种各样的快速定位索引值的技术**，通常这些技术都属于DBA的工作。

###### 17.2.4、删除索引

```sql
DROP INDEX index_name ON talbe_name  

ALTER TABLE table_name DROP INDEX  index_name  

ALTER TABLE table_name DROP PRIMARY KEY  
```

其中，前两条语句是等价的，删除掉table_name中的索引index_name。  第3条语句只在删除PRIMARY KEY索引时使用，因为一个表只可能有一个PRIMARY KEY索引，   `mysql>  ALTER TABLE EMP DROP INDEX test_index;`     

删除后就不再使用索引了，查询会执行全表扫描。  

![img](mysql.assets/clip_image009.jpg)  

## 存储引擎

#### :one:存储引擎涉及的相关知识

mysql可以将数据以不同的技术存储在文件（内存）中，这种技术称为存储引擎。

每一种存储引擎使用不同的存储机制，索引机制，锁定水平、最终提供广泛且不同的功能。

并发控制

- 并发控制：当多个连接对记录进行修改时，保证数据的一致性和完整性

怎么进行并发控制？用锁来实现。

锁

- 共享锁（读锁）：在同一时间段内，多个用户可以读取同一个资源，读取过程中数据不会发生任何变化。

- 排他锁（写锁）：在任何时候只能用一个用户写入资源，当进行写锁时会阻塞其它的写锁和读锁操作。

锁颗粒

- 表锁，是一种开销最小的锁策略
- 行锁，是一种开销最大的锁策略

事务

事务用来保证数据库的完整性

<img src="mysql.assets/image-20200610163000792.png" alt="image-20200610163000792" style="zoom:50%;" />

上图的实现步骤：

1、保证当前用于余额大于等于500的情况下，从当前账户减掉500元

2、在对方账户添加500元

事务的特性

- 原子性
- 一致性
- 隔离性
- 持久性

外键

- 是保证数据一致性的策略

索引

- 是对数据表中一列或多列的值进行排序的一种结构

#### :two:常见存储引擎的特点

![image-20200610163529406](mysql.assets/image-20200610163529406.png)

#### :three:设置数据表的存储引擎

1、通过修改Mysql配置文件my.ini实现

- -default-storage-engine=engine

2、通过创建数据表命令实现

```
create table tab_name(
	...
	...
)ENGINE=xxx;
```

3、alter命令修改存储引擎

```
alter table tab_name ENGINE=xxx;
```



#### :four:常用的存储引擎剖析

###### MyISAM存储引擎(非聚集索引)

MyISAM存储引擎是MySQL最常用的引擎。 

![image-20200610165246643](mysql.assets/image-20200610165246643.png)

它管理的表具有以下特征：

- 使用三个文件表示每个表：
  - 格式文件 — 存储表结构的定义（xxx.frm） 
  - 数据文件 — 存储表行的内容（xxx.MYD） 
  - 索引文件 — 存储表上索引（xxx.MYI）

优点：

- 索引文件和数据文件是分开的，查询很快（可简单理解成是因为这种做法使得索引文件较小）
- 灵活的AUTO_INCREMENT字段处理
- 该引擎的表可被转换为压缩、只读表来节省空间 

缺点：

- 不支持事务处理

**Myisam的数据文件和索引文件底层存储结构**

1、以主键为索引的B+树

![image-20200610170752623](mysql.assets/image-20200610170752623.png)

2、以其它字段为索引的B+树

![image-20200610170938898](mysql.assets/image-20200610170938898.png)

如果上图中的username字段有重复，B+树怎么处理？看下图，有两个g：

![image-20200610171311334](mysql.assets/image-20200610171311334.png)

换一种方式来看Myisam的索引结构：

![image-20200610171527696](mysql.assets/image-20200610171527696.png)

###### InnoDB存储引擎（聚集索引）

InnoDB存储引擎是MySQL的缺省引擎。 

![image-20200610165909319](mysql.assets/image-20200610165909319.png)

它管理的表具有下列主要特征：

- 表的数据+索引文件 —— xxx.ibd
- 格式文件— 存储表结构的定义（xxx.frm）

优点

- InnoDB表空间tablespace被用于存储表的内容
- 提供一组用来记录事务性活动的日志文件
- 用COMMIT(提交)、SAVEPOINT及ROLLBACK(回滚)支持事务处理
- 提供全ACID兼容
- 在MySQL服务器崩溃后提供自动恢复
- 多版本（MVCC）和行级锁定
- 支持外键及引用的完整性，包括级联删除和更新 

缺点

- 查询速度没有Myisam快

**InnoDB的（数据+索引）文件.ibd的底层存储结构**

以主键为索引的B+树：

看到下图，索引跟数据是存放在一起的。

![image-20200610171846224](mysql.assets/image-20200610171846224.png)

2、以其他字段为索引的B+树

看到下图，叶子节点存储的数据是id主键

![image-20200610171922681](mysql.assets/image-20200610171922681.png)

换一种方式来看：

![image-20200610172341670](mysql.assets/image-20200610172341670.png)

###### MEMORY存储引擎

使用MEMORY存储引擎的表，其数据存储在内存中，且行的长度固定，这两个特点使得MEMORY存储引擎非常快。

MEMORY存储引擎管理的表具有下列特征：

- 在数据库目录内，每个表均以.frm格式的文件表示。
- 表数据及索引被存储在内存中。
- 表级锁机制。
- 不能包含TEXT或BLOB字段。

MEMORY存储引擎以前被称为HEAP引擎。 

#### :five:如何选择合适的存储引擎

-  **MyISAM**表最适合于大量的数据**读而少量数据更新**的混合操作。MyISAM表的另一种适用情形是使用压缩的只读表。


-  如果查询中包含**较多的数据更新操作**，应使用**InnoDB**。其行级锁机制和多版本的支持为数据读取和更新的混合操作提供了良好的并发机制。


-  可使用MEMORY存储引擎来**存储非永久需要的数据**，或者是能够从基于磁盘的表中重新生成的数据。 


MYISAM:不支持外键、表锁、插入数据时、锁定整个表、查表总行数时、不需全表扫描

INNODB:支持外键、行锁、查表总行数时、要全表扫描

## 主从复制

#### :one:为什么要进行主从复制

1、在业务复杂的系统中，有这么一个情景，有一句sql语句需要锁表，导致暂时不能使用读的服务，那么就很影响运行中的业务，使用主从复制，让主库负责写，从库负责读，这样，即使主库出现了锁表的情景，通过读从库也可以保证业务的正常运作。

2、做数据的热备

3、架构的扩展。随着业务量越大，IO访问频率过高，单机无法满足，此时做多库的存储，降低磁盘IO访问的频率，提高单个机器的IO性能。

#### :two:主从复制的流程图

<img src="mysql.assets/image-20200610182739754.png" alt="image-20200610182739754" style="zoom: 67%;" />

1. 对主库Master的所有增删改操作（update、delete、insert)，都会被写入到一个binlog日志里面。
2. slave从库向主库发送连接，连接后，主库会创建一个binglog线程，把binlog日志发送给从库
3. 从库接收到binlog日志后，会把它写入到一个中间日志里relay log
4. 然后从库会读取binlog日志，执行一些增删改等操作。

#### :three:基于日志点的复制配置步骤

1、在主服务器上创建复制用户、赋值权限

```sql
create user 'users_name'@'x.x.x.x' identified by 'password';
grant replication slave on *.* to 'user_name'@'%';
```

2、配置主服务器Mysql配置文件My.ini

```sql
1.设置bin_log
bin_log=mysql日志文件路径
2.设置server_id
server_id=可以选择主机IP地址后端，表示唯一编号，要确保主服务器和从服务器的server_id不一样
```

重启主服务器

```
net stop mysql
net start mysql
```

3、配置从服务器mysql配置文件My.ini

```sql
1.设置bin_log
log_bin=mysql日志文件路径
2.设置server_id
server_id=可以选择主机ip地址后端，表示唯一编号
3.设置relay_log中继日志
relay_log=mysql-relay-bin
4.[可选]log_slave_updates允许日志记录到从服务器本机的二进制文件中
log_slave_updates=on
5.[可选]设置read_only只读属性，可以控制没有权限的用户进行写操作
read_only=on
```

4、导出主服务器的数据，再使用导出的数据对从服务器进行初始化

```sql
mysqldump --master-data=2 --single-transaction --triggers --routines --all-databases -u root -p >>导出的文件路径

参数介绍
	--master-data 可以把binlog的位置和文件名添加到输出中，设置等于2会加上注释前缀
	--single-transaction 设置事务的隔离级别、重复读取。不会对数据造成影响
	--triggers 备份所有的触发器
	--routines 备份存储过程和函数
	--all-databases 所有库
	--flush-logs 刷新日志
```

5、启动复制链路

```sql
CHANGE MASTER TO
MASTER_HOST='master_host_ip',
MASTER_USER='master_user',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='mysql_log_filename',
MASTER_LOG_POS=值;  #表示从库到主库的什么位置开始备份的二进制文件的名称及偏移量
```

6、启动从服务

```
start slave  |stop slave
show slave status;  #查看从服务状态
```

基于日志点的复制的

优点：

- 是mysql最早支持的复制技术、BUG相对较少
- 对sql查询没有任何限制
- 故障处理比较容易

缺点:

- 故障转移时，要重新获取新的日志点信息比较困难

### :four:基于GTID的复制

基于GTID的复制是mysql v5.6版本以后支持的

基于GTID的复制与基于日志点的复制存在很大差异

<img src="mysql.assets/image-20200610232146693.png" alt="image-20200610232146693" style="zoom: 50%;" />

基于GTID的复制

<img src="mysql.assets/image-20200610232256138.png" alt="image-20200610232256138" style="zoom:50%;" />

什么是GTID？

- GTID，即全局事务ID，其保证为每一个在主上提交的事务在复制集群中可以生成唯一的id，GTID=source_id:transaction_id

基于GTID的步骤

1、在主服务器上创建复制用户、赋值权限

```sql
create user 'user_name'@'x.x.x.x' identified with msyql_native_password by 'password';
grant replication slave on *.* to 'user_name'@'%'
```

![image-20200610233144790](mysql.assets/image-20200610233144790.png)

![image-20200610233205068](mysql.assets/image-20200610233205068.png)

![image-20200610233221541](mysql.assets/image-20200610233221541.png)

![image-20200610233230346](mysql.assets/image-20200610233230346.png)

## Mysql大小写问题

`MySQL`在`windows`下是不区分大小写的，将`script`文件导入`MySQL`后表名也会自动转化为小写，结果再想要将数据库导出放到`linux`服务器中使用时就出错了。因为在`linux`下表名区分大小写而找不到表，查了很多都是说在`linux`下更改`MySQL`的设置使其也不区分大小写，但是有没有办法反过来让`windows` 下大小写敏感呢。其实方法是一样的，相应的更改`windows`中`MySQL`的设置就行了。

​    具体操作：

​    在`MySQL`的配置文件`my.ini`中增加一行：

​    `lower_case_table_names = 0`

​    其中 `0`：区分大小写，`1`：不区分大小写

​    `MySQL`在`Linux`下数据库名、表名、列名、别名大小写规则是这样的：

　　  1、数据库名与表名是严格区分大小写的；

　　  2、表的别名是严格区分大小写的；

　　  3、列名与列的别名在所有的情况下均是忽略大小写的；

　　  4、变量名也是严格区分大小写的；  `MySQL`在`Windows`下都不区分大小写

