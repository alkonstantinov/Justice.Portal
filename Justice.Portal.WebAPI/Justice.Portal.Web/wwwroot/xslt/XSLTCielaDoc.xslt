<?xml version="1.0" encoding="utf-8"?>
<!--version 4.7-->

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ciela="urn:my-scripts">
  <xsl:output encoding="utf-8" method="html" media-type="text/html" standalone="yes" indent="yes" />
  <msxsl:script language="C#" implements-prefix="ciela">
    <![CDATA[
     public string ConvertSymbol(string symbol)
     {
       System.Text.Encoding bgEncoding51 = System.Text.Encoding.GetEncoding(1251);
       System.Text.Encoding bgEncoding52 = System.Text.Encoding.GetEncoding(1252);
       byte[] bytes = System.Text.Encoding.Convert(bgEncoding52, System.Text.Encoding.UTF8, bgEncoding51.GetBytes(symbol));
       string str2 = System.Text.Encoding.UTF8.GetString(bytes);
       return str2;
     }
     
     public string ConvertMonthToLower(string text)
     {
       return System.Text.RegularExpressions.Regex.Replace( text, 
                                                            "(Януари|Февруари|Март|Април|Май|Юни|Юли|Август|Септември|Октомври|Ноември|Декември)", 
                                                            delegate( System.Text.RegularExpressions.Match m ){ return m.Value.ToLower(); } );
     }
     ]]>
  </msxsl:script>
  <!--<xsl:param name="CurrentEdition" select="456456"></xsl:param> -->
  <xsl:param name="Repealed" select="False"></xsl:param>
  <xsl:param name="DocumentDbId" select=""/>
  <xsl:param name="Language" select=""/>
  
  <xsl:variable name="DocId" select="Doc/@Idna" ></xsl:variable>
  <xsl:variable name="LastEdition" select="Doc/History/div/HistItem[last()]/@Edition"></xsl:variable>
  <xsl:variable name="CurrentEdition" select="Doc/History/div/HistItem[last()]/@Edition"></xsl:variable>
  <xsl:variable name="HasEditions" select="count(Doc/History/div/HistItem)>0"></xsl:variable>
  <xsl:variable name="items" select="Doc/RefItems/Item[@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition]"></xsl:variable>
  <xsl:variable name="Show_EN">Show</xsl:variable>
  <xsl:variable name="Show_BG">Покажи</xsl:variable>
  
  <!-- Общ темплейт за документа -->
  <xsl:template match="/">
    <xsl:text disable-output-escaping="yes">
    <![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]>
  </xsl:text>
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <xsl:if test="$DocumentDbId != ''">
          <xsl:attribute name="id">
            <xsl:value-of select="$DocumentDbId"/>
          </xsl:attribute>
        </xsl:if>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>
          <!-- Заглавие на документа -->
          <xsl:choose>
            <xsl:when test="Doc/DocTitle/TitleEdition">
              <!--получаваме заглавието винаги от последната редакция-->
              <xsl:value-of select="Doc/DocTitle/TitleEdition[2000000 &lt;= @LastEdition]"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="Doc/DocTitle" />
            </xsl:otherwise>
          </xsl:choose>
        </title>
        <script xmlns="http://www.w3.org/1999/xhtml" type="text/javascript">
          function show(id, lang)
          {}

          function ShowBibliography(lang)
          {}

          function HideBibliography(lang)
          {}
        </script>
      </head>
      <xsl:choose>
        <!--Законът не е отменен-->
        <xsl:when test="$Repealed = 'False'">
          <xsl:choose>
            <xsl:when test="$CurrentEdition &lt; $LastEdition">
              <body id="PreviousEdition">
                <xsl:apply-templates select="descendant::Doc"></xsl:apply-templates>
              </body>
            </xsl:when>
            <xsl:otherwise>
              <body id="LatestEdition">
                <xsl:apply-templates select="descendant::Doc"></xsl:apply-templates>
              </body>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <!--Законът е отменен-->
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="$CurrentEdition &lt; $LastEdition">
              <body id="PreviousEditionRepealed">
                <xsl:apply-templates select="descendant::Doc"></xsl:apply-templates>
              </body>
            </xsl:when>
            <xsl:otherwise>
              <body id="LatestEditionRepealed">
                <xsl:apply-templates select="descendant::Doc"></xsl:apply-templates>
              </body>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </html>
  </xsl:template>

  <!-- Темплейт за визуализиране на заглавие на документ -->
  <xsl:template match="DocTitle">
    <xsl:choose>
      <xsl:when test="not(TitleEdition)">
        <xsl:call-template name="DocTitleTemplate">
          <xsl:with-param name="Parent" select="."></xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="DocTitleTemplate">
          <xsl:with-param name="Parent" select="TitleEdition[@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition]"></xsl:with-param>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="DocTitleTemplate">
    <xsl:param name="Parent"></xsl:param>
    <div id="DocumentTitle" class="TitleDocument">
      <p class="Title">
        <xsl:for-each select="$Parent/div">
          <xsl:value-of select="." disable-output-escaping="yes"/>
          <br />
        </xsl:for-each>
      </p>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на PreHistory -->
  <xsl:template match="PreHistory" name="PreHistoryTemplate">
    <xsl:for-each select="div">
      <div class="PreHistory" id="preHistory">
        <xsl:apply-templates></xsl:apply-templates>
      </div>
    </xsl:for-each>
  </xsl:template>

  <!-- Темплейт за визуализиране на история на документ -->
  <xsl:template match="History" name="HistoryOfDocument">
    <div class="HistoryOfDocument" id="historyOfDocument">
      <p class="Title">
        <xsl:for-each select="div">
          <xsl:apply-templates select="."></xsl:apply-templates>
          <br />
        </xsl:for-each>
      </p>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране елемент от история на документ -->
  <xsl:template match="HistItem" name="HistoryItem">
    <xsl:choose>
      <xsl:when test="@Exists=0">
        <span class="HistoryItemDisabled">
          <xsl:value-of select="ciela:ConvertMonthToLower(.)"/>
        </span>
      </xsl:when>
      <xsl:when test="@Edition = $CurrentEdition">
        <span class="HistoryItemSelected">
          <xsl:value-of select="ciela:ConvertMonthToLower(.)"/>
        </span>
      </xsl:when>
      <xsl:otherwise>
        <span class="HistoryItem">
          <xsl:for-each select="./node()">
            <xsl:choose>
              <xsl:when test="self::text()">
                <xsl:value-of select="ciela:ConvertMonthToLower(.)"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:apply-templates select="."></xsl:apply-templates>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </span>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  

  <!-- Темплейт за визуализиране на линк към редакция -->
  <xsl:template match="RefToHistory" name="RefToHistoryItem">
    <span class="HistoryReference" id="h_{../@Edition}" onclick="">
      <xsl:apply-templates></xsl:apply-templates>
    </span>
  </xsl:template>

  <xsl:template match="RefItem">
    <xsl:if test="@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition">
      <xsl:variable name="Group" select="."></xsl:variable>
      <xsl:apply-templates select="$items[@ItemGroup=$Group][1]"></xsl:apply-templates>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Item">
    <xsl:if test="@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition">
      <xsl:choose>
        <xsl:when test="@IdType = 0 or @IdType = 100">
          <xsl:call-template name="TextTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 1 or @IdType = 3">
          <xsl:call-template name="ArticleTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 2">
          <xsl:call-template name="FinalEdictsArticleTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 4 or @IdType = 7">
          <xsl:call-template name="HeadingTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 5">
          <xsl:call-template name="PartTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 6">
          <xsl:call-template name="PortionTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 8">
          <xsl:call-template name="SectionTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 9">
          <xsl:call-template name="UnderSectionTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 10">
          <xsl:call-template name="AdditionalEdictsTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 11">
          <xsl:call-template name="TransitionalEdictsTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 12">
          <xsl:call-template name="FinalEdictsTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 13">
          <xsl:call-template name="TransitionalFinalEdictsTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 59">
          <xsl:call-template name="JudgementTextTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 60">
          <xsl:call-template name="JudgementTextMateriaTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 101">
          <xsl:call-template name="AdditionTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 102">
          <xsl:call-template name="ProjectMotivesTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 103">
          <xsl:call-template name="HeadingBibliographyTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 104">
          <xsl:call-template name="BibliographyTextTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 105">
          <xsl:call-template name="PartTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 106">
          <xsl:call-template name="ProjectEstimationTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:when test="@IdType = 107">
          <xsl:call-template name="EcliTemplate"></xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="TextTemplate"></xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на текст или приложение-->
  <xsl:template name="TextTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на член -->
  <xsl:template name="ArticleTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на член от Преходни и заключителни разпоредби -->
  <xsl:template name="FinalEdictsArticleTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="FinalEdictsArticle" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на част -->
  <xsl:template name="PartTemplate">
    <div class="Part" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на дял -->
  <xsl:template name="PortionTemplate">
    <div class="Portion" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на глава -->
  <xsl:template name="HeadingTemplate">
    <div class="Heading" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на заглавия в библиографията -->
  <xsl:template name="HeadingBibliographyTemplate">
    <div class="Article" style="display: block">
      <xsl:choose>
        <xsl:when test="$Language=1">
          <a href="javascript:show('bibliography', 1)" id="linkShowHideBibliography">
            <xsl:value-of select="$Show_BG"/>
          </a>
        </xsl:when>
        <xsl:otherwise>
          <a href="javascript:show('bibliography', 2)" id="linkShowHideBibliography">
            <xsl:value-of select="$Show_EN"/>
          </a>
        </xsl:otherwise>
      </xsl:choose>
    </div>
    <div id="bibliography" style="display: none;">
      <div class="Heading" id="b_{@IdItem}" style="display: block;">
        <!-- xsl:apply-templates select="Title"></xsl:apply-templates -->
      </div>
      <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на раздел -->
  <xsl:template name="SectionTemplate">
    <div class="Section" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на подраздел -->
  <xsl:template name="UnderSectionTemplate">
    <div class="UnderSection" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на ДопълнитеAdditionalEdictsTemplateлни разпоредби -->
  <xsl:template  name="AdditionalEdictsTemplate">
    <div class="AdditionalEdicts" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на Преходни разпоредби -->
  <xsl:template name="TransitionalEdictsTemplate">
    <div class="TransitionalFinalEdicts" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на Заключителни разпоредби -->
  <xsl:template name="FinalEdictsTemplate">
    <div class="FinalEdicts" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на Преходни и заключителни разпоредби -->
  <xsl:template name="TransitionalFinalEdictsTemplate">
    <div class="TransitionalFinalEdicts" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на Долепки -->
  <xsl:template name="AdditionTemplate">
    <div class="TransitionalFinalEdicts" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title"></xsl:apply-templates>
    </div>
    <xsl:apply-templates select="Item | RefItem"></xsl:apply-templates>
  </xsl:template>

  <!-- Темплейт за визуализиране на Проектомотиви -->
  <xsl:template name="ProjectMotivesTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на Предварителна оценка на въздействието на законопроекта -->
  <xsl:template name="ProjectEstimationTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на ECLI -->
  <xsl:template name="EcliTemplate">
    <div class="Ecli" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на заглавие на елемент -->
  <xsl:template match="Title" name="TitleTemplate">
    <xsl:if test="not(@LastEdition) or (@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition)">
      <p class="Title">
        <xsl:for-each select="div">
          <xsl:apply-templates></xsl:apply-templates>
          <br />
        </xsl:for-each>
      </p>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на параграф в текст -->
  <xsl:template match="Text" name="DivTemplate">
    <xsl:variable name="idItem" select="../../@IdItem"></xsl:variable>
    <xsl:for-each select="div">
      <xsl:choose>
        <!--ако имаме празен <div></div>-->
        <xsl:when test="not(child::node())">
          <br />
        </xsl:when>
        <xsl:when test="table">
          <xsl:apply-templates></xsl:apply-templates>
        </xsl:when>
        <xsl:when test="@type = 'par'">
          <div id="{$idItem}_par_{@no}" class="par">
            <xsl:apply-templates>
            </xsl:apply-templates>
          </div>
        </xsl:when>
        <xsl:when test="@type">
          <div class="{@type}">
            <xsl:apply-templates>
            </xsl:apply-templates>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <div>
            <xsl:apply-templates>
            </xsl:apply-templates>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>

  <!--Темплейт за визуализиране на чист текст-->
  <xsl:template match="text()" name="plainText">
    <xsl:value-of select="." disable-output-escaping="yes"/>
  </xsl:template>

  <!-- Темплейт за визуализиране на текст във Библиографията-->
  <xsl:template name="BibliographyTextTemplate">
    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="b_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на вътрешен линк -->
  <xsl:template match="InnerRef" name="InnerRefTemplate">
    <span class="SameDocReference" id="ref_{@Idref}" onclick="" >
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на елементите на EUROVOC descriptor -->
  <xsl:template match="EuroVocRef" name="EuroVocRefTemplate">
    <span class="SameDocReference" onmouseout="window.external.HideLinkContent(this)" onclick="">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на елементите на Код на регистър -->
  <xsl:template match="StructureRef" name="StructureRefRefTemplate">
    <span class="SameDocReference" onmouseout="window.external.HideLinkContent(this)" onclick="" >
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на външен линк -->
  <xsl:template match="Ref" name="RefTemplate">
    <span class="NewDocReference{@type}" id="ref_{@Idref}" onclick="">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!--Темплейт за визуализиране на link, който сочи към web адрес-->
  <xsl:template match="OutRef" name="OutrefTemplate">
    <a href="{@Link}" target="_blank">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </a>
  </xsl:template>

  <!--Темплейт за визуализиране на цветен текст-->
  <xsl:template match="Stain | Font">
    <span style="color:#{@Colour};">
      <xsl:value-of select="."/>
    </span>
  </xsl:template>

  <!--темплейт за визуализиране на символ-->
  <xsl:template match="symbol">
    <span style="font-family:Symbol;">
      <xsl:value-of select="ciela:ConvertSymbol(text())"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на supercript/subscript -->
  <xsl:template match="sub | sup">
    <xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
  <xsl:template name="RefIndexAttr">
    <xsl:choose>
      <xsl:when test="@indexNew">
        <xsl:value-of select="@indexNew"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="@index"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Темплейт за визуализиране на грешка в xml-a -->
  <xsl:template match="error" name="ErrorTemplate">
    <span class="error">
      <xsl:value-of select="."/>
    </span>
  </xsl:template>
</xsl:stylesheet>