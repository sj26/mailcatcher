<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/xml">
    <section class="fractal-analysis">
      <h1>Fractal Results</h1>
      <xsl:choose>
        <xsl:when test="not(result/errors/node())">
          <p class="report-intro valid">Your HTML and CSS for your email is valid.</p>
        </xsl:when>
        <xsl:otherwise>
          <p class="report-intro invalid">Your HTML and CSS for your email contains potential errors:</p>
          <ol>
            <xsl:for-each select="result/errors/error">
              <li>
                <p class="error-intro">The <code><xsl:value-of select="rule/rule_name" /></code> near <code><xsl:value-of select="snippet" /></code> on line <code><xsl:value-of select="error_line" /></code> of your code.</p>
                <dl class="unsupported-clients">
                  <dt>This is unsupported in:</dt>
                  <dd>
                    <ul>
                      <xsl:for-each select="rule/email_client//item">
                        <li><xsl:value-of select="." /></li>
                      </xsl:for-each>
                    </ul>
                  </dd>
                </dl>
              </li>
            </xsl:for-each>
          </ol>
        </xsl:otherwise>
      </xsl:choose>
    </section>
  </xsl:template>
</xsl:stylesheet>
