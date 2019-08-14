<?xml version="1.0" encoding="utf-8"?>
<!--version 4.7-->

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ciela="urn:my-scripts" xmlns:imageManager="urn:image-manager">
  <xsl:output encoding="utf-8" method="html" media-type="text/html" standalone="yes" indent="yes" />

  <xsl:param name="CurrentEdition" select="456456"></xsl:param>
  <xsl:param name="Repealed" select="False"></xsl:param>
  <xsl:param name="LicenseLastEdition" select="Doc/History/div/HistItem[last()]/@Edition"></xsl:param>
  <xsl:param name="LicenseExpiredText" select="'Attention! License Expired!'"></xsl:param>
  <xsl:param name="DocumentDbId" select="0"/>
  <xsl:param name="Language" select="1"/>
  <xsl:param name="CurrentDate" select="''"/>

  <xsl:variable name="DocId" select="Doc/@Idna" ></xsl:variable>
  <xsl:variable name="LastEdition" select="Doc/History/div/HistItem[last()]/@Edition"></xsl:variable>
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
          {
          var cont1 = document.getElementById(id);
          if(cont1 == null) return;

          var hideMsg = lang == 1 ? "Скрий":"Hide";
          var showMsg = lang == 1 ? "Покажи":"Show";

          if(cont1.style.display == 'none')
          {
          cont1.style.display = 'block';
          linkShowHideBibliography.innerHTML = hideMsg;
          }
          else
          {
          cont1.style.display = 'none';
          linkShowHideBibliography.innerHTML = showMsg;
          }
          }

          function ShowBibliography(lang)
          {
          var cont1 = document.getElementById('bibliography');
          if(cont1 == null) return;

          cont1.style.display = 'block';
          linkShowHideBibliography.innerHTML = lang == 1 ? "Скрий":"Hide";
          }

          function HideBibliography(lang)
          {
          var cont1 = document.getElementById('bibliography');
          if(cont1 == null) return;

          cont1.style.display = 'none';
          linkShowHideBibliography.innerHTML = lang == 1 ? "Покажи":"Show";
          }
        </script>
        <!--<link rel="stylesheet" type="text/css"  href="D:\Ciela Revolution\Ciela TransformFiles\CSSCielaDoc-v3.3.css"></link>-->
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
    <!--Проверка дали трябва да се изведе надпис на потребителя, че му е изтекъл лиценза-->
    <xsl:if test="$LicenseLastEdition &lt; $LastEdition">
      <div class="AlertLicenseExpired">
        <xsl:value-of select="$LicenseExpiredText"/>
      </div>
    </xsl:if>
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
          <xsl:value-of select="."/>
        </span>
      </xsl:when>
      <xsl:when test="@Edition = $CurrentEdition">
        <span class="HistoryItemSelected">
          <xsl:value-of select="."/>
        </span>
      </xsl:when>
      <xsl:when test="@Edition &gt; $LicenseLastEdition">
        <span class="HistoryItemDisabled">
          <xsl:value-of select="."/>
        </span>
      </xsl:when>
      <xsl:otherwise>
        <span class="HistoryItem">
          <xsl:for-each select="./node()">
            <xsl:choose>
              <xsl:when test="self::text()">
                <xsl:value-of select="."/>
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
    <span class="HistoryReference" id="h_{../@Edition}" onclick="window.external.OpenEdition({../@Edition})">
      <xsl:apply-templates></xsl:apply-templates>
    </span>
  </xsl:template>

  <xsl:template match="RefItems">
  </xsl:template>

  <!--За новата структура на документите-->
  <xsl:template match="RefItem">
    <xsl:if test="@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition">
      <xsl:variable name="Group" select="."></xsl:variable>
      <xsl:apply-templates select="$items[@ItemGroup=$Group][1]"></xsl:apply-templates>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Item">
    <xsl:if test="@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition">
      <xsl:choose>
        <xsl:when test="@IdType = 0">
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
        <xsl:when test="@IdType = 100">
          <xsl:call-template name="AppendixTemplate"></xsl:call-template>
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

  <!-- Темплейт за визуализиране на приложение-->
  <xsl:template name="AppendixTemplate">
    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="Group" select="@ItemGroup"></xsl:variable>

    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
    <xsl:if test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
      <xsl:call-template name="DisplayPreviousAppendixTemplate">
        <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
        <xsl:with-param name="CurrentText" select="$PostponedInforceText"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на предишна редакция на приложение, когато влиза в сила в бъдещето -->
  <xsl:template name="DisplayPreviousAppendixTemplate">
    <xsl:param name="CurrentItem"/>
    <xsl:param name="CurrentText"/>

    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="$CurrentItem/@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="StartEdition" select="$CurrentItem/@FirstEdition"></xsl:variable>
    <xsl:variable name="Group" select="$CurrentItem/@ItemGroup"></xsl:variable>

    <xsl:choose>
      <xsl:when test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
        <xsl:call-template name="DisplayPreviousAppendixTemplate">
          <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
          <xsl:with-param name="CurrentText" select="$CurrentText"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <div class="PostponedEditionText" id="postEditionText_i_{$CurrentItem/@IdItem}">
          <xsl:choose>
            <xsl:when test="$Language = 2">
              <xsl:value-of select="concat('Edition to SG, ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory))"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="concat('Редакция към ДВ, бр. ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-before(substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory), 'г.'), ' г.')"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
        <div class="PostponedArticleEdition" id="postEdition_i_{$CurrentItem/@IdItem}" style="display:block;">
          <xsl:apply-templates select="$CurrentItem/Title | $CurrentItem/Text"></xsl:apply-templates>
        </div>
        <br />

        <xsl:value-of select="imageManager:LoadItemImages( $CurrentItem/@IdItem, $CurrentItem )"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Темплейт за визуализиране на член -->
  <xsl:template name="ArticleTemplate">
    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="Group" select="@ItemGroup"></xsl:variable>

    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="Article" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
    <xsl:if test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
      <xsl:call-template name="DisplayPreviousArticleTemplate">
        <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
        <xsl:with-param name="CurrentText" select="$PostponedInforceText"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на предишна редакция на член, когато влиза в сила в бъдещето -->
  <xsl:template name="DisplayPreviousArticleTemplate">
    <xsl:param name="CurrentItem"/>
    <xsl:param name="CurrentText"/>

    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="$CurrentItem/@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="StartEdition" select="$CurrentItem/@FirstEdition"></xsl:variable>
    <xsl:variable name="Group" select="$CurrentItem/@ItemGroup"></xsl:variable>

    <xsl:choose>
      <xsl:when test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
        <xsl:call-template name="DisplayPreviousArticleTemplate">
          <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
          <xsl:with-param name="CurrentText" select="$CurrentText"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <div class="PostponedEditionText" id="postEditionText_i_{$CurrentItem/@IdItem}">
          <xsl:choose>
            <xsl:when test="$Language = 2">
              <xsl:value-of select="concat('Edition to SG, ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory))"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="concat('Редакция към ДВ, бр. ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-before(substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory), 'г.'), ' г.')"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
        <div class="PostponedArticleEdition" id="postEdition_i_{$CurrentItem/@IdItem}" style="display:block;">
          <xsl:apply-templates select="$CurrentItem/Title | $CurrentItem/Text"></xsl:apply-templates>
        </div>
        <br />

        <xsl:value-of select="imageManager:LoadItemImages( $CurrentItem/@IdItem, $CurrentItem )"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Темплейт за визуализиране на член от Преходни и заключителни разпоредби -->
  <xsl:template name="FinalEdictsArticleTemplate">
    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="Group" select="@ItemGroup"></xsl:variable>

    <xsl:call-template name="ItemButtons"></xsl:call-template>
    <div class="FinalEdictsArticle" id="i_{@IdItem}" style="display:block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
    <xsl:if test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
      <xsl:call-template name="DisplayPreviousFinalEdictsArticleTemplate">
        <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
        <xsl:with-param name="CurrentText" select="$PostponedInforceText"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на предишна редакция на член от Преходни и заключителни разпоредби, когато влиза в сила в бъдещето -->
  <xsl:template name="DisplayPreviousFinalEdictsArticleTemplate">
    <xsl:param name="CurrentItem"/>
    <xsl:param name="CurrentText"/>

    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="$CurrentItem/@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="StartEdition" select="$CurrentItem/@FirstEdition"></xsl:variable>
    <xsl:variable name="Group" select="$CurrentItem/@ItemGroup"></xsl:variable>

    <xsl:choose>
      <xsl:when test="$PostponedInforceText and //RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
        <xsl:call-template name="DisplayPreviousFinalEdictsArticleTemplate">
          <xsl:with-param name="CurrentItem" select="//RefItems/Item[@ItemGroup = $Group and @FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
          <xsl:with-param name="CurrentText" select="$CurrentText"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <div class="PostponedEditionText" id="postEditionText_i_{$CurrentItem/@IdItem}">
          <xsl:choose>
            <xsl:when test="$Language = 2">
              <xsl:value-of select="concat('Edition to SG, ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory))"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="concat('Редакция към ДВ, бр. ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-before(substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory), 'г.'), ' г.')"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
        <div class="PostponedArticleEdition" id="postEdition_i_{$CurrentItem/@IdItem}" style="display:block;">
          <xsl:apply-templates select="$CurrentItem/Title | $CurrentItem/Text"></xsl:apply-templates>
        </div>
        <br />

        <xsl:value-of select="imageManager:LoadItemImages( $CurrentItem/@IdItem, $CurrentItem )"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!--темплейт за поставяне на бутони към елемент-->
  <xsl:template name="ItemButtons">
    <xsl:variable name="idItem">
      <xsl:choose>
        <xsl:when test="@ItemGroup">
          <xsl:value-of select="@ItemGroup"/>
        </xsl:when>
        <xsl:when test="@IdType=0 or @IdType=100">
          <xsl:value-of select="@IdOldItem"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="@IdItem"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <div id="buttons_{@IdItem}">
      <!--проверка за бутоните от експертизи и разследване-->
      <xsl:if test="RefsFromExperts or RefsFromInvestigation">
        <xsl:apply-templates select="RefsFromExperts"></xsl:apply-templates>
        <xsl:apply-templates select="RefsFromInvestigation"></xsl:apply-templates>
      </xsl:if>
      <br />
      <!--Проверяваме дали документът има редакции - ако няма, то не изследваме членовете за стари редакции-->
      <xsl:if test="$HasEditions">
        <xsl:apply-templates select="HasOldEditions"></xsl:apply-templates>
      </xsl:if>
      <xsl:apply-templates select="RefsFromActs">
        <xsl:with-param name="idItem" select="$idItem"></xsl:with-param>
      </xsl:apply-templates>
      <xsl:apply-templates select="RefsFromPractices">
        <xsl:with-param name="idItem" select="$idItem"></xsl:with-param>
      </xsl:apply-templates>
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

  <!--Елементи с IdType 59 и 60 се срещат в решенията -->
  <!-- Темплейт за визуализиране на текста в решението -->
  <xsl:template name="JudgementTextTemplate">
    <xsl:if test="RefsFromActs or RefsFromPractices">
      <xsl:call-template name="ItemButtons"></xsl:call-template>
    </xsl:if>
    <div class="JudgementText" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>

  <!-- Темплейт за визуализиране на материя на решението (диспозитив) -->
  <xsl:template name="JudgementTextMateriaTemplate">
    <xsl:if test="RefsFromActs or RefsFromPractices">
      <xsl:call-template name="ItemButtons"></xsl:call-template>
    </xsl:if>
    <div class="JudgementTextMateria" id="i_{@IdItem}" style="display: block;">
      <xsl:apply-templates select="Title | Text"></xsl:apply-templates>
    </div>
  </xsl:template>
  <!--край на специфичните за решенията елементи-->

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
    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="@FirstEdition - 1"></xsl:variable>

    <xsl:if test="not(@LastEdition) or (@FirstEdition &lt;= $CurrentEdition and $CurrentEdition &lt;= @LastEdition)">
      <p class="Title">
        <xsl:for-each select="div">
          <xsl:apply-templates></xsl:apply-templates>
          <br />
        </xsl:for-each>
      </p>
      <xsl:if test="$PostponedInforceText and ../Title[@FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
        <xsl:call-template name="DisplayPreviousTitleTemplate">
          <xsl:with-param name="CurrentItem" select="../Title[@FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
          <xsl:with-param name="CurrentText" select="$PostponedInforceText"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:if>
  </xsl:template>

  <!-- Темплейт за визуализиране на предишна редакция на заглавие на елемент, когато влиза в сила в бъдещето -->
  <xsl:template name="DisplayPreviousTitleTemplate">
    <xsl:param name="CurrentItem"/>
    <xsl:param name="CurrentText"/>

    <xsl:variable name="PostponedInforceText" select="''"></xsl:variable>
    <xsl:variable name="PreviousEdition" select="$CurrentItem/@FirstEdition - 1"></xsl:variable>
    <xsl:variable name="StartEdition" select="$CurrentItem/@FirstEdition"></xsl:variable>

    <xsl:choose>
      <xsl:when test="$PostponedInforceText and $CurrentItem/../Title[@FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]">
        <xsl:call-template name="DisplayPreviousTitleTemplate">
          <xsl:with-param name="CurrentItem" select="$CurrentItem/../Title[@FirstEdition &lt;= $PreviousEdition and $PreviousEdition &lt;= @LastEdition]"/>
          <xsl:with-param name="CurrentText" select="$CurrentText"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <p class="PostponedEditionText" id="postEditionText_i_{$CurrentItem/../@IdItem}">
          <xsl:choose>
            <xsl:when test="$Language = 2">
              <xsl:value-of select="concat('Edition to SG, ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory))"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="concat('Редакция към ДВ, бр. ', //HistItem[@Edition=$StartEdition]/RefToHistory, substring-before(substring-after(//HistItem[@Edition=$StartEdition], //HistItem[@Edition=$StartEdition]/RefToHistory), 'г.'), ' г.')"/>
            </xsl:otherwise>
          </xsl:choose>
        </p>
        <p class="PostponedTitle" id="postEdition_i_{$CurrentItem/../@IdItem}" style="display:block;">
          <xsl:for-each select="$CurrentItem/div">
            <xsl:apply-templates></xsl:apply-templates>
            <br />
          </xsl:for-each>
        </p>
      </xsl:otherwise>
    </xsl:choose>
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
    <span class="SameDocReference" id="ref_{@Idref}" onclick="window.external.OpenRef(this,{@Idref})" onmouseover="window.external.ShowLinkContent(this,{@Idref})" onmouseout="window.external.HideLinkContent(this)">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на елементите на EUROVOC descriptor -->
  <xsl:template match="EuroVocRef" name="EuroVocRefTemplate">
    <span class="SameDocReference" onmouseout="window.external.HideLinkContent(this)" onclick="window.external.OpenEuroVocLink('{.}')" onmouseover="window.external.ShowLinkContent(this,'{.}')">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на елементите на Код на регистър -->
  <xsl:template match="StructureRef" name="StructureRefRefTemplate">
    <span class="SameDocReference" onmouseout="window.external.HideLinkContent(this)" onclick="window.external.OpenStructureLink('{@IdType}', 1, {@IdLanguage})" onmouseover="window.external.ShowLinkContent(this,'{@IdType}')" >
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на вътрешен линк (временен, за редакторските цели) -->
  <xsl:template match="TempInnerRef" name="TempInnerRefTemplate">
    <xsl:variable name="attrIndex">
      <xsl:call-template name="RefIndexAttr"></xsl:call-template>
    </xsl:variable>
    <span class="SameDocReference" id="tempref_{@IdItem}" onclick="window.external.OpenTempRef(this,{@RefType},{@ToIdna},{@ToIdstr},{@ToIdItem},{@ToType},{@ToNo},{@ToSubno},{@ToItemGroup})" onmouseover="window.external.ShowTempLinkContent(this,{@RefType},{@ToIdna},{@ToIdstr},{@ToIdItem},{@ToType},{@ToNo},{@ToSubno},{@ToItemGroup},'{$attrIndex}')" onmouseout="window.external.HideLinkContent(this)">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на външен линк -->
  <xsl:template match="Ref" name="RefTemplate">
    <span class="NewDocReference{@type}" id="ref_{@Idref}" onclick="window.external.OpenRef(this,{@Idref})" onmouseover="window.external.ShowLinkContent(this,{@Idref})" onmouseout="window.external.HideLinkContent(this)">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на външен линк (временен, за редакторските цели) -->
  <xsl:template match="TempRef" name="TempRefTemplate">
    <xsl:variable name="attrIndex">
      <xsl:call-template name="RefIndexAttr"></xsl:call-template>
    </xsl:variable>
    <span class="NewDocReference{@type}" id="tempref_{@IdItem}" onclick="window.external.OpenTempRef(this,{@RefType},{@ToIdna},{@ToIdstr},{@ToIdItem},{@ToType},{@ToNo},{@ToSubno},{@ToItemGroup})" onmouseover="window.external.ShowTempLinkContent(this,{@RefType},{@ToIdna},{@ToIdstr},{@ToIdItem},{@ToType},{@ToNo},{@ToSubno},{@ToItemGroup},'{$attrIndex}')" onmouseout="window.external.HideLinkContent(this)">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на линк към легална дефиниция -->
  <xsl:template match="LegalRef" name="LegalRefTemplate">
    <span class="LegalDocReference" id="ref_{@Idref}" onclick="window.external.OpenRef(this,{@Idref})" onmouseover="window.external.ShowLinkContent(this,{@Idref})" onmouseout="window.external.HideLinkContent(this)">
      <xsl:value-of select="." disable-output-escaping="yes"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на външен линк (временен, за редакторските цели) -->
  <xsl:template match="TempLegalRef" name="TempLegalRefTemplate">
    <span class="LegalDocReference" id="tempref_">
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
      <xsl:value-of select="text()"/>
    </span>
  </xsl:template>

  <!-- Темплейт за визуализиране на supercript/subscript -->
  <xsl:template match="sub | sup">
    <xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>

  <!-- Темплейт за визуализиране на картинка при Препратки от Актове към Документа -->
  <xsl:template match="RefsFromActs" name="RefsAtoD">
    <xsl:param name="idItem"></xsl:param>
    <div class="picRefsFromActs" title="Препратки от документи" id="btnRefsFromActs_{../@IdItem}"  onclick="window.external.OpenRefsFromActs({$DocId},{../@IdType},{../@No}, {../@SubNo},{$idItem})"></div>
  </xsl:template>

  <!-- Темплейт за визуализиране на картинка при Препратки от Практика към Документа -->
  <xsl:template match="RefsFromPractices" name="RefsPtoD">
    <xsl:param name="idItem"></xsl:param>
    <div class="picRefsFromPractices" title="Препратки от практика" id="btnRefsFromPractices_{../@IdItem}"  onclick="window.external.OpenRefsFromPractics({$DocId},{../@IdType},{../@No}, {../@SubNo},{$idItem})"></div>
  </xsl:template>

  <!--Темплейт за визуализиране на картинка, когато елемент има редакции-->
  <xsl:template match="HasOldEditions" name="OldEditions">
    <div class="picHasEditions" title="Редакции на елемента" id="btnHasEditions_{../@IdItem}" onclick="window.external.OpenOldItemEdition({../@IdItem})"></div>
  </xsl:template>

  <!-- Темплейт за визуализиране на картинка документи от Експертизи -->
  <xsl:template match="RefsFromExperts" name="RefsEtoD">
    <div class="picRefsFromExperts" title="Експертизи" id="btnRefsFromExperts_{../@IdItem}"  onclick="window.external.OpenRefsFromExperts({@ButtonIdRef},{$DocId},{../@IdType},{../@No}, {../@SubNo},{../@IdItem})"></div>
  </xsl:template>

  <!-- Темплейт за визуализиране на картинка при документите от Разследване -->
  <xsl:template match="RefsFromInvestigation" name="RefsItoD">
    <div class="picRefsFromInvestigation" title="Разследване" id="btnRefsFromInvestigation_{../@IdItem}"  onclick="window.external.OpenRefsFromInvestigation({@ButtonIdRef},{$DocId},{../@IdType},{../@No}, {../@SubNo},{../@IdItem})"></div>
  </xsl:template>

  <!-- Темплейт за визуализиране на картинка при Препратки от Други към Документа -->
  <xsl:template match="RefsOthersToDocs" name="RefsOtoD">
    <!-- tuk da se sloji kartinka i da se namesti pravilno -->
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