<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/xml">
  
  <section class="fractal-analysis">
  <xsl:for-each select="result/errors/error">
    <xsl:variable name="errorCount" select="position()"/>
    <p class="report-intro">
      <strong><xsl:value-of select="$errorCount" />.</strong> The <span class="code"><xsl:value-of select="rule/rule_name" /></span> near <span class="code"><xsl:value-of select="snippet" /></span> on line <span class="code"><xsl:value-of select="error_line" /></span> of your code.
    </p>
    <dl class="unsupported-clients">
      <dt>This is unsupported in:</dt>
      <dd>
        <ul>
          <xsl:for-each select="rule/email_client//item">
          <li>
            <xsl:value-of select="." />
          </li>
          </xsl:for-each>
        </ul>    
      </dd>
    </dl>
  </xsl:for-each>
  </section>
  </xsl:template>
</xsl:stylesheet>