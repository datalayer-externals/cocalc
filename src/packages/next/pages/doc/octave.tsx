import Link from "next/link";
import { Layout } from "antd";
import Footer from "components/landing/footer";
import A from "components/misc/A";
import Header from "components/landing/header";
import Content from "components/landing/content";
import withCustomize from "lib/with-customize";
import { Customize } from "lib/customize";
import SignIn from "components/landing/sign-in";
import Info from "components/landing/info";
import Pitch from "components/landing/pitch";
import Head from "components/landing/head";
import Snapshots from "components/landing/snapshots";

const octave = <A href="https://www.gnu.org/software/octave/index">Octave</A>;
const title = "Run Octave Online";

export default function Octave({ customize }) {
  return (
    <Customize value={customize}>
      <Head title={title} />
      <Layout>
        <Header />
        <Layout.Content>
          <div style={{ backgroundColor: "#c7d9f5" }}>
            <Content
              startup={"Octave"}
              logo={"octave-logo.svg"}
              title={title}
              subtitle={
                <>
                  Run {octave} in an online Terminal, a Jupyter Notebook or an
                  X11 desktop. The syntax is largely compatible with MATLAB®!
                </>
              }
              image={"cocalc-octave-jupyter-20200511.png"}
            />
          </div>

          <Pitch
            col1={
              <>
                <h3>Run Octave on CoCalc</h3>
                <ul>
                  <li>
                    Via CoCalc's own real-time synchronized{" "}
                    <strong>
                      <Link href="/doc/jupyter-notebook">
                        <a>Jupyter Notebooks</a>
                      </Link>
                    </strong>{" "}
                    –{" "}
                    <A href="https://doc.cocalc.com/jupyter.html">learn more</A>
                    .
                  </li>
                  <li>
                    A full, collaborative, real-time synchronized{" "}
                    <strong>
                      <Link href="/doc/terminal">
                        <a>Linux Terminal</a>
                      </Link>
                    </strong>{" "}
                    –{" "}
                    <A href="https://doc.cocalc.com/terminal.html">
                      learn more
                    </A>
                    .
                  </li>
                  <li>
                    A{" "}
                    <strong>
                      <Link href="/doc/x11">
                        <a>virtual X11 graphical Linux desktop</a>
                      </Link>
                    </strong>{" "}
                    – <A href="https://doc.cocalc.com/x11.html">learn more</A>.
                  </li>
                </ul>
                <br />
                <h3>Packages</h3>
                <div>
                  Browse a{" "}
                  <Link href="/doc/software-octave">
                    <a>list of all installed Octave packages...</a>
                  </Link>
                </div>
              </>
            }
            col2={
              <>
                <h3>Benefits of working online</h3>
                <ul>
                  <li>
                    You no longer have to <strong>install and maintain</strong>{" "}
                    Octave. In particular when you're{" "}
                    <Link href="/doc/teaching">
                      <a>teaching a class</a>
                    </Link>
                    , students just have to sign in to CoCalc to get started!
                  </li>
                  <li>
                    All your files are private, stored persistently, snapshotted
                    and backed up.
                  </li>
                  <li>
                    You can invite <strong>collaborators</strong> to your
                    project to simultaneously edit the same files.
                  </li>
                  <li>
                    Everything runs remotely, which means you do not have to
                    worry about messing up your own computer.{" "}
                  </li>
                </ul>
              </>
            }
          />

          <SignIn startup="Octave" />

          <Info.Heading
            description={
              <>There are many ways to use Octave online via CoCalc.</>
            }
          >
            Feature Overview
          </Info.Heading>

          <Info
            title="Jupyter Notebook support"
            icon="ipynb"
            image="cocalc-octave-jupyter-20200511.png"
            anchor="a-jupyter"
          >
            <p>
              CoCalc offers its own Jupyter Notebook implementation. It has a
              few key advantages.
            </p>
            <ol>
              <li>
                <strong>Realtime synchronization</strong>: two or more
                collaborators can edit the same notebook at the same time.
                Everyone sees what others are typing.
              </li>
              <li>
                <strong>Remote session</strong>: the notebook's kernel runs
                remotely. This means you only need a web browser and Internet
                access. Don't worry about software setup.
              </li>
              <li>
                If you depend on using the classical Jupyter notebook or
                JupyterLab, it is also very easy to{" "}
                <A href="https://doc.cocalc.com/jupyter.html#alternatives-plain-jupyter-server-and-jupyterlab-server">
                  use Octave via these services as well
                </A>
                .
              </li>
            </ol>
          </Info>

          <Info
            title="Octave in a Terminal"
            icon="octave"
            image="cocalc-octave-terminal-20200511.png"
            anchor="a-terminal"
            caption="Octave in CoCalc's Terminal"
          >
            <p>
              You can edit Octave code and run it in a Terminal as{" "}
              <A href="https://doc.cocalc.com/frame-editor.html">
                explained here
              </A>
              .
            </p>
            <p>
              File changes are tracked in detail via{" "}
              <A href="https://doc.cocalc.com/time-travel.html">TimeTravel</A>:
              this means you can see the progress of your changes or see exactly
              what collaborators and students did when you weren't looking.
            </p>
          </Info>

          <Info
            title="Octave in an X11 Graphical Desktop"
            icon="window-restore"
            image="cocalc-octave-x11-20200511.png"
            anchor="a-x11"
          >
            <p>
              You can start Octave's GUI in a full remote desktop as
              <A href="https://doc.cocalc.com/x11.html">explained here</A>.
            </p>
            <p>
              Accessing a full GUI app remotely adds latency, but you're freed
              from the limitations of a Terminal or Jupyter Notebook. Multiple
              people can interact with the graphical Octave app from different
              web browsers, though you're limited to one mouse cursor.
            </p>
          </Info>

          <Info
            title="Octave in an X11 Terminal"
            icon="terminal"
            image="octave-x11-terminal.png"
            anchor="a-x11-terminal"
            caption="X11 Terminal with interactive 3D plot"
          >
            <p>
              Run any graphical applications written for Octave in your web
              browser!
            </p>
            <p>
              You can start Octave in the X11 graphical terminal. When you plot
              graphics they will appear in a window to the right. If you paste{" "}
              <A href="https://octave.org/doc/v4.2.1/Three_002dDimensional-Plots.html#Three_002dDimensional-Plots">
                this code
              </A>
              , you can then grab and rotate the 3D plot.
            </p>
          </Info>

          <Snapshots />

          <SignIn startup="Octave" />
        </Layout.Content>
        <Footer />
      </Layout>
    </Customize>
  );
}

export async function getServerSideProps() {
  return await withCustomize();
}