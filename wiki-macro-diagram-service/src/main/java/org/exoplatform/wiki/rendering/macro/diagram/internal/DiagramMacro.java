package org.exoplatform.wiki.rendering.macro.diagram.internal;

import java.util.Collections;
import java.util.List;

import javax.inject.Named;

import org.xwiki.component.annotation.Component;
import org.xwiki.rendering.block.Block;
import org.xwiki.rendering.block.RawBlock;
import org.xwiki.rendering.macro.AbstractMacro;
import org.xwiki.rendering.macro.MacroExecutionException;
import org.xwiki.rendering.syntax.Syntax;
import org.xwiki.rendering.transformation.MacroTransformationContext;

import org.exoplatform.portal.application.PortalRequestContext;
import org.exoplatform.web.application.JavascriptManager;
import org.exoplatform.webui.application.portlet.PortletRequestContext;
import org.exoplatform.wiki.rendering.macro.diagram.DiagramMacroParameters;

/**
 * A Diagram Macro.
 */
@Component
@Named("diagram")
public class DiagramMacro extends AbstractMacro<DiagramMacroParameters> {
  /**
   * Create and initialize the descriptor of the macro.
   */
  public DiagramMacro() {
    super("Diagram Macro", "Macro to generate diagram image", DiagramMacroParameters.class);
    setDefaultCategory(DEFAULT_CATEGORY_CONTENT);
  }

  /**
   * {@inheritDoc}
   */
  public List<Block> execute(DiagramMacroParameters parameters,
                             String content,
                             MacroTransformationContext context) throws MacroExecutionException {
    StringBuilder sb = new StringBuilder();
    sb.append("<div class='mermaid-diagram' hidden wikiparam='");
    sb.append(content.replaceAll("'", "\\'").replaceAll("&g", ">"));
    sb.append("'></div>");

    PortletRequestContext portletRequestContext = (PortletRequestContext)PortalRequestContext.getCurrentInstance();
    JavascriptManager javascriptManager = portletRequestContext.getJavascriptManager();
    javascriptManager.require("SHARED/wikiMermaid");
//    
//    PortletRequestContext portletRequestContext = (PortletRequestContext)PortalRequestContext.getCurrentInstance();
//    JavascriptManager javascriptManager = portletRequestContext.getJavascriptManager();
//    javascriptManager.require("SHARED/wikiMermaid");

    RawBlock rawBlock = new RawBlock(sb.toString(), Syntax.XHTML_1_0);
    return Collections.singletonList((Block) rawBlock);
  }

  
  /**
   * {@inheritDoc}
   */
  public boolean supportsInlineMode() {
    return true;
  }
}
